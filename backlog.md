 # Desk Booking System User Stories

## 1. Booking a desk

**As an employee, I want to book an available desk for a specific date, so that I can guarantee a workspace when I come into the office.**

**Acceptance criteria**

- I can select a date and see the desks available on that date.
- I can select an available desk and confirm the booking.
- The system shows me a confirmation containing the date and desk details.
- A desk cannot be booked by more than one person for the same date.

## 2. Cancelling a booking

**As an employee, I want to cancel my desk booking, so that the desk becomes available if my plans change.**

**Acceptance criteria**

- I can view my upcoming bookings.
- I can cancel one of my upcoming bookings.
- The system confirms that the booking has been cancelled.
- The cancelled desk is shown as available for that date.

## 3. Seeing available desks

**As an employee, I want to see which desks are free on a given day, so that I can choose a suitable workspace before booking.**

**Acceptance criteria**

- I can choose a date to search.
- The system clearly distinguishes available desks from booked desks.
- I can view relevant desk details, such as location, floor, or equipment.
- The availability reflects bookings and cancellations that have already been processed.

## 4. Viewing and managing my bookings

**As an employee, I want to view my current and upcoming desk bookings, so that I can keep track of where I am scheduled to work.**

**Acceptance criteria**

- I can see my upcoming bookings in date order.
- Each booking shows the date and desk details.
- I can open a booking to view its full details.
- I can cancel an eligible booking from the booking details.

## 5. Finding a desk by requirements

**As an employee, I want to filter available desks by requirements such as location, floor, accessibility, or equipment, so that I can find a workspace that meets my needs.**

**Acceptance criteria**

- I can apply one or more filters when searching for desks.
- The results show only desks that are available on the selected date and match the filters.
- I can clear filters and return to the full list of available desks.
- If no desks match, the system explains that no suitable desks are available.

## Planner implementation

The sprint planning functionality is implemented in
[planner_core.py](./planner_core.py) and persists its state in `state.json`.

### JSON state structure

The state file contains three collections:

- `tasks`: task records with an `id`, `title`, and `description`.
- `sprints`: sprint records with an `id`, `name`, `status`, and `task_ids`.
- `retrospective_cards`: cards with an `id`, `sprint_id`, `category`, and `text`.

Allowed sprint statuses are:

- `Planning`
- `Active`
- `Completed`

Allowed retrospective categories are:

- `Went Well`
- `To Improve`
- `Action Item`

### Supported operations

The command-line script supports the following workflow:

1. Create a sprint in `Planning`.
2. Start a planning sprint, changing it to `Active`.
3. Add tasks to an `Active` sprint.
4. Complete an active sprint, changing it to `Completed`.
5. Add retrospective cards to a `Completed` sprint.

Example commands:

```bash
python planner_core.py create-sprint "Desk booking MVP"
python planner_core.py start-sprint sprint-1
python planner_core.py add-task sprint-1 "Booking a desk" "Book an available desk."
python planner_core.py complete-sprint sprint-1
python planner_core.py add-retro sprint-1 "Went Well" "The booking flow was clear."
```

The script saves state after each successful operation. It also validates
status transitions and prevents tasks or retrospective cards from being added
to sprints in an invalid state.