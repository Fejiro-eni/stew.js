# Stew.js

A lightweight helper library for AJAX forms, UI toggles, value monitoring, and notifications.
Built for speed and simplicity — stew.js helps you save time when developing forms, UI elements, and small interactions.

## 📦 Features

### 1. AJAX Form Handling
- Add class `.ajaxform` to your form.
- Automatically handles submission via AJAX and processes JSON responses from the backend.
- Response JSON format:
  {
    "type": "success",
    "js": "alert('done')",
    "html": "<p>Some content</p>"
  }
- Keys:
  - type: "success" or "error".
  - js: JavaScript or jQuery code to execute after the AJAX request.
  - html: Injected into an element with id="[form_id]-html".

### 2. Value Change Detection
- Works with <input>, <select>, and <textarea> elements.
- Show/hide a submit button when value changes from default.
- Required attributes:
  - button: Selector for the button (e.g. #saveBtn or .saveBtn).
  - default_value: Original value to compare against.
- Optional:
  - new-js: JS code to run when value changes from default.
  - default-js: JS code to run when value returns to default.

### 3. UI Toggles
- Elements with `.sw-toggle` can animate another element in/out of view.
- Attributes:
  - sw-condition: Condition to check before enabling.
  - sw-transition: Transition time in seconds.
  - sw-animate: Animation style (fromright, fromleft).
  - sw-display: Selector for the element to toggle.
  - sw-init-js: JS to run on initialization.
  - sw-active-js: JS to run when element becomes active.
  - sw-inactive-js: JS to run when element becomes inactive.

### 4. Toast Notifications
- Simple alerts that fade after a set time.
- Syntax:
  toast("Hello World", 3000, "black", "white");
  - message: The text to display.
  - duration: Time in milliseconds (default 3000).
  - backgroundColor: Default "rgba(0,0,0,0.64)".
  - textColor: Default "white".

### 5. Slide-in Notifications
- Rich notifications with title, icon, and link.
- Syntax:
  notify("Message body", "Title", "icon.png", "https://example.com", 5000, "white");
  - text: Body message.
  - title: Heading text.
  - icon: Image URL.
  - link: Clickable link.
  - notifyDuration: Auto-dismiss time in ms (default 0 = stays until dismissed).
  - backgroundColor: Background color for notification.

## 🚀 Getting Started

### Installation
Download stew.js and include it after jQuery in your HTML:
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="stew.js"></script>

### Example Usage
<form class="ajaxform" action="/submit.php" method="post">
    <input type="text" name="username" default_value="John" button="#saveBtn" new-js="console.log('changed')" default-js="console.log('reset')">
    <button type="submit" id="saveBtn" style="display:none;">Save</button>
</form>

<script>
    toast("Welcome!", 2000);
    notify("You have a new message", "Inbox", "icon.png", "/messages", 4000);
</script>

## 📄 License

MIT License

Copyright (c) 2020 Fejiro Eni

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:



## ✍ Author

- Fejiro Eni
- Twitter: None
- Website: [Fejiro Eni](https://fejiro-eni.github.io/)

## 💡 Notes

- Stew.js depends on jQuery.
- For best results, include stew.css for additional animations/styles.
- This library is intentionally minimal — extend it for your own needs.
