"""A small terminal Kanban board for the desk booking user stories."""

from dataclasses import dataclass
from textwrap import fill
from typing import Dict, List, Optional


STATUSES = ("To Do", "In Progress", "Done")


@dataclass
class Task:
    """A unit of work represented on the Kanban board."""

    title: str
    description: str
    status: str = "To Do"

    def __post_init__(self) -> None:
        if self.status not in STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(STATUSES)}")


class Board:
    """Stores tasks and displays them in status columns."""

    def __init__(self) -> None:
        self.columns: Dict[str, List[Task]] = {status: [] for status in STATUSES}

    @property
    def tasks(self) -> List[Task]:
        """Return all tasks in column order."""
        return [task for status in STATUSES for task in self.columns[status]]

    def add_task(
        self, title: str, description: str, status: str = "To Do"
    ) -> Task:
        """Add a task to the requested column."""
        task = Task(title=title, description=description, status=status)
        self.columns[status].append(task)
        return task
 

    def find_task(self, title: str) -> Optional[Task]:
        """Find a task by its title."""
        return next((task for task in self.tasks if task.title == title), None)

    def move_task_next(self, title: str) -> Task:
        """Move a task one column to the right."""
        task = self.find_task(title)
        if task is None:
            raise ValueError(f"Task not found: {title}")
            """In here check if the value of the next area is in progress if it is then check if it is == 1 if  it is = 1 then refuse to move"""
        current_index = STATUSES.index(task.status)
        if current_index == len(STATUSES) - 1:
            raise ValueError(f"Task is already {task.status}: {title}")

        self.columns[task.status].remove(task)
        task.status = STATUSES[current_index + 1]
        self.columns[task.status].append(task)
        return task

    def move_task_previous(self, title: str) -> Task:
        """Move a task one column to the left."""
        task = self.find_task(title)
        if task is None:
            raise ValueError(f"Task not found: {title}")
        current_index = STATUSES.index(task.status)
        if current_index == 0:
            raise ValueError(f"{title} cannot be moved back")

        confirm = input("Type yes to confirm ")
        if confirm == "yes":
            self.columns[task.status].remove(task)
            task.status = STATUSES[current_index - 1]
            self.columns[task.status].append(task)
            return task
        else:
            print("Confirm failed, task not moved back")

    def display(self) -> str:
        """Return the board grouped into readable status sections."""
        lines = ["=" * 72, "DESK BOOKING KANBAN BOARD", "=" * 72]
        for status in STATUSES:
            tasks = self.columns[status]
            lines.extend(
                (
                    "",
                    f"{status.upper()} ({len(tasks)})",
                    "-" * 72,
                )
            )
            if not tasks:
                lines.append("  No tasks")
                continue

            for number, task in enumerate(tasks, start=1):
                lines.append(f"  {number}. {task.title}")
                lines.append(f"     {fill(task.description, width=65, subsequent_indent='     ')}")
        lines.extend(("", "=" * 72))
        return "\n".join(lines)


def create_desk_booking_board() -> Board:
    """Create a board containing the five desk-booking user stories."""
    board = Board()
    stories = (
        (
            "Booking a desk",
            "Book an available desk for a specific date.",
        ),
        (
            "Cancelling a booking",
            "Cancel an upcoming desk booking.",
        ),
        (
            "Seeing available desks",
            "See which desks are free on a given day.",
        ),
        (
            "Viewing and managing my bookings",
            "View current and upcoming desk bookings.",
        ),
        (
            "Finding a desk by requirements",
            "Filter available desks by location, accessibility, or equipment.",
        ),
    )
    for title, description in stories:
        board.add_task(title, description)
    return board


def run_commands(board: Board) -> None:
    """Run the basic interactive commands for a board."""
    print("Desk Booking Kanban")
    print("Commands: show, add, move, back, help, quit")
    while True:
        command = input("\nkanban> ").strip().lower()

        if command in {"quit", "exit"}:
            return
        if command == "show":
            print(board.display())
        elif command == "add":
            title = input("Title: ").strip()
            description = input("Description: ").strip()
            if not title or not description:
                print("Title and description are required.")
            else:
                board.add_task(title, description)
                print(f"Added: {title}")
        elif command == "move":
            title = input("Task title: ").strip()
            try:
                task = board.move_task_next(title)
                print(f"Moved '{task.title}' to {task.status}.")
            except ValueError as error:
                print(error)
        elif command == "back":
            title = input("Task title: ").strip()
            try:
                task = board.move_task_previous(title)
                print(f"Moved '{task.title}' to {task.status}.")
            except ValueError as error:
                print(error)
        elif command == "help":
            print("show - display tasks in their columns")
            print("add  - add a task to To Do")
            print("move - move a task to the next column")
            print("back - move a task to the previous column")
            print("quit - exit the board")
        else:
            print("Unknown command. Type 'help' to see available commands.")


if __name__ == "__main__":
    run_commands(create_desk_booking_board())
