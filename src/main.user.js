var sidebar = document.getElementById("sidebar-content");

var para = document.createElement("p");
var NotCheckbox = document.createElement("INPUT");
NotCheckbox.type = "checkbox";
NotCheckbox.checked = true;
var text = document.createTextNode("Notify me");
para.appendChild(NotCheckbox);
para.appendChild(text);
sidebar.appendChild(para);
sidebar.insertBefore(para, sidebar.childNodes[4]);

para = document.createElement("p");
var btn = document.createElement("BUTTON");
btn.appendChild(document.createTextNode("Ignore User"));
btn.onclick = function() {
  var tempUser = prompt("Enter nick:");
  userIgnore(tempUser);
  pushMessage({
    nick: '*',
    text: "User " + tempUser + " has been added to your ignore list."
  });
};
para.appendChild(btn);
sidebar.appendChild(para);
sidebar.insertBefore(para, sidebar.childNodes[5]);

para = document.createElement("p");
btn = document.createElement("BUTTON");
btn.appendChild(document.createTextNode("Ban User"));
btn.onclick = function() {
  send({
    cmd: 'ban',
    nick: prompt("Enter nick:")
  })
};
para.appendChild(btn);
sidebar.appendChild(para);
sidebar.insertBefore(para, sidebar.childNodes[6]);

if (pushMessageOrig)
  pushMessage = pushMessageOrig;

var pushMessageOrig = pushMessage;
var yourNick = myNick.split("#")[0];
pushMessage = function(args) {
  pushMessageOrig(args);
  if (args.nick != "*") {
    var msg = args.text;
    if (msg.indexOf(yourNick) != -1 && !document.hasFocus())
      if (NotCheckbox.checked)
        notifyMe(args.nick, args.text);
  }
  if (document.hasFocus()) {
    window.unread = 0;
    window.updateTitle();
  }
}

var notifications = [];

window.onfocus = function() {
  for (var i = 0; i < notifications.length; i++) {
    notifications[i].close();
  }
  notifications = [];
  window.unread = 0;
  window.updateTitle();
}

function notifyMe(sender, text) {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chrome.');
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else
    _notifiyMe(sender, text);
}

function _notifiyMe(sender, text) {
  var not = new Notification(sender + " mentioned you", {
    body: text,
    icon : 'http://i.imgur.com/44B3G6a.png'
  });

  not.onclick = function() {
    window.focus()
  };
  setTimeout(function() {
    not.close();
    notifications.splice(notifications.indexOf(not), 1);
  }, 4000);
  notifications.push(not);
}


/*
$\color{orange}{\large{Hack.Chat \space chrome \space extension}} \space \color{lightblue}{0.0.3}$
download here: https://db.tt/8ErFlCcq
just drag and drop in: chrome://extensions/

Fixed;
- unread message count does no longer count while tab is active
- final version of the notification system, this time everything should work 100%

Added;
- Icon for notifications
*/
