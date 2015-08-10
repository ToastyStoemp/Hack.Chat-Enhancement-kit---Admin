var messageSound = new Audio('https://www.freesound.org/people/bubaproducer/sounds/107156/download/107156__bubaproducer__button-9-funny.wav');
var notifySound = new Audio('https://www.freesound.org/people/JustinBW/sounds/80921/download/80921__justinbw__buttonchime02up.wav');
var modSound = new Audio('https://www.freesound.org/people/JustinBW/sounds/80921/download/80921__justinbw__buttonchime02up.wav');
var canCallMod = true;

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
var SoundCheckbox = document.createElement("INPUT");
SoundCheckbox.type = "checkbox";
SoundCheckbox.checked = true;
text = document.createTextNode("Sound");
para.appendChild(SoundCheckbox);
para.appendChild(text);
sidebar.appendChild(para);
sidebar.insertBefore(para, sidebar.childNodes[5]);

para = document.createElement("p");
var AlarmCheckbox = document.createElement("INPUT");
AlarmCheckbox.type = "checkbox";
AlarmCheckbox.checked = true;
text = document.createTextNode("Alarm me");
para.appendChild(AlarmCheckbox);
para.appendChild(text);
sidebar.appendChild(para);
sidebar.insertBefore(para, sidebar.childNodes[6]);

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
sidebar.insertBefore(para, sidebar.childNodes[7]);

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
sidebar.insertBefore(para, sidebar.childNodes[8]);

if (pushMessageOrig)
  pushMessage = pushMessageOrig;

var pushMessageOrig = pushMessage;
var yourNick = myNick.split("#")[0];
pushMessage = function(args) {
  pushMessageOrig(args);
  var msg = args.text;
  if (msg.indexOf("invited you to ?") != -1) {
    var nick = msg.substr(0, msg.indexOf(' '));
    var channel = msg.substr(msg.indexOf('?') + 1, 8);
    notifyMe(nick + " invited you", "Click here to accept.", false, channel);
  }
  if (args.nick != "*") {
    if (msg.indexOf('.callMod') != -1) {
      if (canCallMod) {
        send({
          cmd: 'chat',
          nick: myNick,
          text: '@' + args.nick + ' I have been alarmed'
        });
        var begin = msg.indexOf(' ') + 1;
        var end = msg.indexOf(' ', begin);
        var suspectlength = end - begin;
        var suspect = msg.substr(begin, suspectlength);
        _callMod(args.nick, suspect, msg.substr(end, msg.length - end));
      }
    }
    if (msg.indexOf(yourNick) != -1 && !document.hasFocus()) {
      if (NotCheckbox.checked)
        notifyMe(args.nick + " mentioned you", args.text, false);
    } else
    if (SoundCheckbox.checked)
      messageSound.play();
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

function notifyMe(title, text, channel) {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chrome.');
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else
    _notifiyMe(title, text, channel);
}

function _notifiyMe(title, text, channel) {
  if (SoundCheckbox.checked)
    notifySound.play();
  var Channel = channel;
  var not = new Notification(title, {
    body: text,
    icon: 'http://i.imgur.com/44B3G6a.png'
  });


  not.onclick = function() {
    if (Channel) {
      console.log(Channel);
      window.open('https://hack.chat/?' + Channel, '_blank');
    } else
      window.focus()
  };
  setTimeout(function() {
    not.close();
    notifications.splice(notifications.indexOf(not), 1);
  }, 8000);
  notifications.push(not);
}


function _callMod(sender, suspect, reason) {
  if (canCallMod && AlarmCheckbox.checked) {
    canCallMod = false;
    modSound.play();
    var not = new Notification(sender + ' requested a moderator', {
      body: suspect + " is under suspicion of " + reason,
      icon: 'http://i.imgur.com/44B3G6a.png'
    });
    not.onclick = function() {
      window.focus()
    };
    setTimeout(function() {
      canCallMod = true;
    }, 30000);
    setTimeout(function() {
      not.close();
      notifications.splice(notifications.indexOf(not), 1);
    }, 8000);
  }
}


// $\color{orange}{\large{Hack.Chat \space chrome \space extension}} \space \color{lightblue}{0.0.4}$
// $made \space by \space \color{cyan}{ToastyStoemp}$
// download here: https://db.tt/8ErFlCcq
// just drag and drop in: chrome://extensions/
// GitHub: http://bit.ly/1ISXn6b
//
// Fixed:
// - Fixed bug with the admin version notification not working every now and then
// - Doubled the length of the notifications
//
// Added:
// - sound for chat, and notifications
// - option for sound
// - Call mod button
// - Special notification receiver for mods only admin version
//
// More to come!
