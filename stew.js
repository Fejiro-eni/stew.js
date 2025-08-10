/**
 * stew.js
 * A lightweight helper library for AJAX form handling, UI toggles, value monitoring, and simple notifications.
 *
 * @author        Fejiro Eni
 * @package       Stew
 * @version       1.0.3
 * @license       MIT License
 * 
 * MIT License
 * 
 * Copyright (c) 2020 Fejiro Eni
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * -----------------------------------------------------------------------------
 * FEATURES:
 * -----------------------------------------------------------------------------
 * 1. AJAX Form Handling:
 *    - Class `.ajaxform` for forms that submit via AJAX.
 *    - Backend returns JSON with:
 *        type: "success" or "error" (string)
 *        js:   JavaScript/jQuery code to execute after request
 *        html: HTML content to inject into an element matching [form_id]-html
 *
 * 2. Input Value Change Detection:
 *    - Inputs, selects, or textareas can monitor value changes.
 *    - Required attributes:
 *        button: Selector for button to show/hide on value change.
 *        default_value: The original (default) value.
 *    - Optional attributes:
 *        new-js:     JS to run when value changes from default.
 *        default-js: JS to run when value returns to default.
 *
 * 3. UI Toggles:
 *    - Elements with `.sw-toggle` can show/hide elements with animations.
 *    - Attributes:
 *        sw-condition:  Condition to check before applying.
 *        sw-transition: Transition time in seconds.
 *        sw-animate:    Animation type (e.g., fromright, fromleft).
 *        sw-display:    Selector for element to toggle.
 *        sw-init-js, sw-active-js, sw-inactive-js: Hooks for JS execution.
 *
 * 4. Toast Notifications:
 *    - toast(message, duration, backgroundColor, textColor)
 *    - Defaults: duration=3000ms, bg=rgba(0,0,0,0.64), textColor=white
 *
 * 5. Slide-In Notifications:
 *    - notify(text, title, icon, link, notifyDuration, backgroundColor)
 *    - Dismiss with dismissNotification()
 */

$(document).ready(function () {

    let errmessage = "",
        test = "",
        active_errmessage = "",
        active_test = "",
        inactive_errmessage = "",
        inactive_test = "";

    // -----------------------------
    // UI Toggles
    // -----------------------------
    $(".sw-toggle").each(function () {
        let condition = $(this).attr("sw-condition") || "",
            transition = parseFloat($(this).attr("sw-transition")) || 0.6,
            animation = ($(this).attr("sw-animate") || "").toLowerCase(),
            position = ($(this).attr("sw-position") || "").toLowerCase(),
            element = $(`${$(this).attr("sw-display")}`) || "",
            init_js = $(this).attr("sw-init-js") || $(this).attr("sw-initjs") || "",
            inactive_js = $(this).attr("sw-inactivejs") || $(this).attr("sw-inactive-js") || "",
            active_js = $(this).attr("sw-active-js") || $(this).attr("sw-activejs") || "";

        inactive_js += ";inactive_test='ok';";
        active_js += ";active_test='ok';";
        init_js += ";test='ok';";

        if ($(this).attr("sw-display") && eval(condition)) {
            if (animation === "fromright") {
                $("html").css("overflow-x", "hidden");
                if (position === "" || position === "fullscreen") {
                    element.css({
                        position: "fixed",
                        marginLeft: "100%",
                        transition: `${transition}s`,
                        top: "0",
                        height: "100vh",
                        width: "100%",
                        zIndex: "1000000000"
                    });
                }
            }

            try { eval(init_js); }
            catch (err) { errmessage = err.message; }

            if (test !== "ok") {
                alert(`JavaScript error in sw-init-js for sw-display='${$(this).attr("sw-display")}'. Check console.`);
                console.error(`Javascript Error: '${errmessage}'`);
                console.error(init_js);
            }
        }

        $(this).on("click", function () {
            if (animation === "fromright") {
                const target = $(`${$(this).attr("sw-display")}`);
                if (target.css("margin-left") !== "0px") {
                    target.css("margin-left", "0%");
                    try { eval(active_js); }
                    catch (err) {
                        inactive_errmessage = err.message;
                        alert(`JavaScript error in sw-active-js for sw-display='${$(this).attr("sw-display")}'.`);
                        console.error(`Javascript Error: '${active_errmessage}'`);
                        console.error(active_js);
                    }
                } else {
                    target.css("margin-left", "100%");
                    try { eval(inactive_js); }
                    catch (err) {
                        active_errmessage = err.message;
                        alert(`JavaScript error in sw-inactive-js for sw-display='${$(this).attr("sw-display")}'.`);
                        console.error(`Javascript Error: '${inactive_errmessage}'`);
                        console.error(inactive_js);
                    }
                }
            }
        });
    });

});

// -----------------------------
// AJAX Form Handling
// -----------------------------
let response_html = '';
$(".ajaxform").on("submit", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const form = $(this);
    const url = form.attr('action');
    const value = document.activeElement.getAttribute('value');
    const html = document.activeElement.innerHTML;

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize() + "&" + document.activeElement.name + "=" + document.activeElement.value,
        timeout: 60000,
        beforeSend: function () {
            form.find('[type="submit"]').html('Updating<connect></connect>').val("Updating");
            form.css({ opacity: "0.4", pointerEvents: "none" });
        },
        success: function (response) {
            form.css({ opacity: "1", pointerEvents: "all" });
            form.find('[type="submit"]').html(html).val(value);

            response = $.parseJSON(response);
            if (response.type.trim() === "success") {
                if (response.html.trim()) { response_html = response.html; $(`${form.attr("id")}form`); }
                if (response.js) eval(response.js);
            } else {
                if (response.html) { response_html = response.html; $(`${form.attr("id")}form`); }
                if (response.js) eval(response.js);
            }
        },
        error: function () {
            form.css({ opacity: "1", pointerEvents: "all" });
            form.find('[type="submit"]').html(html).val(value);
            alert("Could not connect.\nPlease check your internet connection and try again.");
        }
    });
});

// -----------------------------
// Input/Select Change Detection
// -----------------------------
$("input[button!=''], select[button!='']").on("change keyup", function () {
    if ($(this).val() !== $(this).attr("default_value")) {
        $(`${$(this).attr("button")}`).addClass('shake').css('display', 'inline-block');
        eval($(this).attr('new-js'));
    } else {
        $(`${$(this).attr("button")}`).removeClass('shake').css('display', 'none');
        eval($(this).attr('default-js'));
    }
});

$("textarea[button!='']").on("change keyup", function () {
    if ($(this).val().replace("\"", "'") !== $(this).attr("default_value") ||
        $(this).html().replace("\"", "'") !== $(this).attr("default_value")) {
        $(`${$(this).attr("button")}`).addClass('shake').css('display', 'inline-block');
        eval($(this).attr('new-js'));
    } else {
        $(`${$(this).attr("button")}`).removeClass('shake').css('display', 'none');
        eval($(this).attr('default-js'));
    }
});

// -----------------------------
// Toast Notification
// -----------------------------
$("body").append('<div id="toast" style="display:none; border:1px solid; width:100%; position:fixed; bottom:10px; right:10px; max-width:200px; padding:10px; border-radius:3px; background-color:rgba(0,0,0,0.64); color:white; text-align:center; font-size:14px; z-index:10000000000000000;"></div>');

function toast(text, duration = 3000, bkgrd_color = "rgba(0,0,0,0.64)", color = "white") {
    if (bkgrd_color) $("#toast").css("background-color", bkgrd_color);
    if (color) $("#toast").css("color", color);
    $("#toast").show().html(text);
    setTimeout(() => { $("#toast").hide().html(""); }, duration);
}

// -----------------------------
// Slide-in Notification
// -----------------------------
$("body").append('<div id="notification" style="width:100%; position:fixed; bottom:20px; right:-100%; transition:.6s; max-width:300px; padding:10px; border-radius:3px; color:gray; text-align:left; font-size:14px; z-index:2147483646; box-shadow:0 0 5px grey; overflow:hidden;"><dismiss onclick="dismissNotification()" style="padding:0.3em; color:#ff4d3f; font-size:1.2em; right:0; top:0; position:absolute; cursor:pointer; padding:5px; background:#fdeeee;" title="dismiss"><i class="fa fa-arrow-right" style="margin-left:5px;"></i></dismiss><p style="display:flex;"><img src="" style="height:2em; width:2em;"><heading style="border-left:1px solid gray; padding:0.3em; margin:0 5px; color:black;"></heading></p><text style="display:block; line-height:1.2em; font-size:0.9em;"></text><div style="text-align:right; margin-top:10px;"><a href="" style="color:#2196F3; display:inline-block; cursor:pointer;" class="notification_link">View Now...</a></div></div>');

let notifyDuration = 0;
function notify(text = "", title = "", icon = "https://unicus.live/images/unicus_icon.png", link = "", notifyDuration = 0, bkgrd_color = "white") {
    if (text === "" && title === "") return;
    $("#notification").css("background-color", bkgrd_color);
    $("#notification text").html(text);
    $("#notification heading").html(title);
    $("#notification .notification_link").attr("href", link);
    $("#notification img").attr("src", icon);
    $("#notification").css("right", "20px");
    if (notifyDuration > 0) {
        setTimeout(() => { $("#notification dismiss").trigger('click'); }, notifyDuration);
    }
}

function dismissNotification() {
    $("#notification").css("right", "-100%");
}

// -----------------------------
// Connecting Dots Animation
// -----------------------------
let connectdots = 4;
setInterval(function () {
    if (connectdots > 2) $('connect').html("");
    $('connect').html($('connect').html() + ".");
    connectdots++;
    if (connectdots > 3) connectdots = 0;
}, 500);
