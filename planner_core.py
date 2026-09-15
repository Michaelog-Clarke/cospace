"""Persistent sprint and retrospective planning.

The state.json schema is:

{
  "tasks": [{"id": "task-1", "title": "...", "description": "..."}],
  "sprints": [{
    "id": "sprint-1",
    "name": "...",
    "status": "Planning",
    "task_ids": ["task-1"]
  }],
  "retrospective_cards": [{
    "id": "retro-1",
    "sprint_id": "sprint-1",
    "category": "Went Well",
    "text": "..."
  }]
}
"""

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List


SPRINT_STATUSES = ("Planning", "Active", "Completed")
RETROSPECTIVE_CATEGORIES = ("Went Well", "To Improve", "Action Item")


class Planner:
    """Manage sprints, tasks, and retrospective cards in a JSON file."""

    def __init__(self, state_path: str = "state.json") -> None:
        self.state_path = Path(state_path)
        self.state: Dict[str, Any] = self.load()

    def load(self) -> Dict[str, Any]:
        if not self.state_path.exists():
            return {"tasks": [], "sprints": [], "retrospective_cards": []}

        with self.state_path.open(encoding="utf-8") as state_file:
            state = json.load(state_file)
        for key in ("tasks", "sprints", "retrospective_cards"):
            if not isinstance(state.get(key), list):
                raise ValueError(f"state.json must contain a list named '{key}'")
        return state

    def save(self) -> None:
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        temporary_path = self.state_path.with_suffix(".tmp")
        with temporary_path.open("w", encoding="utf-8") as state_file:
            json.dump(self.state, state_file, indent=2)
            state_file.write("\n")
        temporary_path.replace(self.state_path)

    def create_sprint(self, name: str) -> Dict[str, Any]:
        sprint = {
            "id": self._next_id("sprint", "sprints"),
            "name": name,
            "status": "Planning",
            "task_ids": [],
        }
        self.state["sprints"].append(sprint)
        self.save()
        return sprint

    def start_sprint(self, sprint_id: str) -> Dict[str, Any]:
        sprint = self._sprint(sprint_id)
        if sprint["status"] != "Planning":
            raise ValueError("Only a sprint in Planning can be started")
        sprint["status"] = "Active"
        self.save()
        return sprint

    def add_task(
        self, sprint_id: str, title: str, description: str
    ) -> Dict[str, Any]:
        sprint = self._sprint(sprint_id)
        if sprint["status"] != "Active":
            raise ValueError("Tasks can only be added to an Active sprint")

        task = {
            "id": self._next_id("task", "tasks"),
            "title": title,
            "description": description,
        }
        self.state["tasks"].append(task)
        sprint["task_ids"].append(task["id"])
        self.save()
        return task

    def complete_sprint(self, sprint_id: str) -> Dict[str, Any]:
        sprint = self._sprint(sprint_id)
        if sprint["status"] != "Active":
            raise ValueError("Only a sprint in Active can be completed")
        sprint["status"] = "Completed"
        self.save()
        return sprint

    def add_retrospective_card(
        self, sprint_id: str, category: str, text: str
    ) -> Dict[str, Any]:
        sprint = self._sprint(sprint_id)
        if sprint["status"] != "Completed":
            raise ValueError(
                "Retrospective cards can only be added to a Completed sprint"
            )
        if category not in RETROSPECTIVE_CATEGORIES:
            raise ValueError(
                "Category must be one of: "
                + ", ".join(RETROSPECTIVE_CATEGORIES)
            )

        card = {
            "id": self._next_id("retro", "retrospective_cards"),
            "sprint_id": sprint_id,
            "category": category,
            "text": text,
        }
        self.state["retrospective_cards"].append(card)
        self.save()
        return card

    def _sprint(self, sprint_id: str) -> Dict[str, Any]:
        for sprint in self.state["sprints"]:
            if sprint["id"] == sprint_id:
                return sprint
        raise ValueError(f"Sprint not found: {sprint_id}")

    def _next_id(self, prefix: str, collection: str) -> str:
        existing_ids = {
            item["id"]
            for item in self.state[collection]
            if isinstance(item.get("id"), str)
        }
        number = 1
        while f"{prefix}-{number}" in existing_ids:
            number += 1
        return f"{prefix}-{number}"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Manage sprint planning state")
    parser.add_argument("--state", default="state.json", help="Path to state JSON")
    commands = parser.add_subparsers(dest="command", required=True)

    commands.add_parser("help", help="Show planner commands and examples")

    create = commands.add_parser("create-sprint")
    create.add_argument("name")

    start = commands.add_parser("start-sprint")
    start.add_argument("sprint_id")

    add_task = commands.add_parser("add-task")
    add_task.add_argument("sprint_id")
    add_task.add_argument("title")
    add_task.add_argument("description")

    complete = commands.add_parser("complete-sprint")
    complete.add_argument("sprint_id")

    retro = commands.add_parser("add-retro")
    retro.add_argument("sprint_id")
    retro.add_argument("category", choices=RETROSPECTIVE_CATEGORIES)
    retro.add_argument("text")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    if args.command == "help":
        print(
            """Planner commands:

  create-sprint NAME
      Create a sprint in Planning.

  start-sprint SPRINT_ID
      Start a Planning sprint and change it to Active.

  add-task SPRINT_ID TITLE DESCRIPTION
      Add a task to an Active sprint.

  complete-sprint SPRINT_ID
      Complete an Active sprint.

  add-retro SPRINT_ID CATEGORY TEXT
      Add a retrospective card to a Completed sprint.
      CATEGORY must be: Went Well, To Improve, or Action Item.

Examples:
  python planner_core.py create-sprint "Desk booking MVP"
  python planner_core.py start-sprint sprint-1
  python planner_core.py add-task sprint-1 "Book a desk" "Book an available desk."
  python planner_core.py complete-sprint sprint-1
  python planner_core.py add-retro sprint-1 "Went Well" "The flow was clear."

Use --help after a command for detailed argument help.
"""
        )
        return

    planner = Planner(args.state)

    if args.command == "create-sprint":
        result = planner.create_sprint(args.name)
    elif args.command == "start-sprint":
        result = planner.start_sprint(args.sprint_id)
    elif args.command == "add-task":
        result = planner.add_task(args.sprint_id, args.title, args.description)
    elif args.command == "complete-sprint":
        result = planner.complete_sprint(args.sprint_id)
    else:
        result = planner.add_retrospective_card(
            args.sprint_id, args.category, args.text
        )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
