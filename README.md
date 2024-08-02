## Overview
This application is designed to send desktop notifications at regular intervals, reminding users to complete a task, or any other activities. The application is highly customizable, allowing users to specify the notification message, title, and interval time in minutes through command-line arguments. 

## Features
* Customizable Notifications: Users can specify the notification title, message, and interval time through command-line arguments.
* Timestamped Notifications: Each notification includes the current time in the title, providing context for when the reminder was sent.
* User Interaction Handling: Notifications include "Yes" and "No" actions. If the user selects "Yes", further notifications are stopped.
* Persistent Reminders: If the user does not interact with the notification within a specified timeframe (10 seconds), the notification is resent to ensure the reminder is acknowledged.

## Usage
* `git clone https://github.com/Raza9798/personal-reminder`
* `cd personal-reminder`
* `npm run build`
* `npm run start`




ADD YOUR REMINDERS AND THE DURATION THEN ENABLE THE REMINDER FOR GET THE NOTIFICATION