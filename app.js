//this is not related to Auth0. It's just here to make the page work correctly.
Prism.plugins.NormalizeWhitespace.setDefaults({
  'remove-trailing': true,
  'remove-indent': true,
  'left-trim': true,
  'right-trim': true
});
var logs = [];
if (window.localStorage.auth0logs) {
  logs = JSON.parse(window.localStorage.auth0logs);
}
function printLogs() {
  window.localStorage.auth0logs = JSON.stringify(logs);
  var code = '';
  logs.forEach(function(l) {
    code += '\r\n' + JSON.stringify(l, null, 1);
  });
  var html = Prism.highlight(code, Prism.languages.javascript);
  $('#logger').html(html);
}
function clearLogs() {
  logs = [];
  window.localStorage.removeItem('auth0logs');
  printLogs();
}
function subscribeToEvents(instance) {
  var validEvents = [
    'show',
    'hide',
    'unrecoverable_error',
    'authenticated',
    'authorization_error',
    'hash_parsed',
    'signin ready',
    'signup ready',
    'forgot_password ready',
    'socialOrPhoneNumber ready',
    'socialOrEmail ready',
    'vcode ready',
    'forgot_password submit',
    'signin submit',
    'signup submit',
    'socialOrPhoneNumber submit',
    'socialOrEmail submit',
    'vcode submit',
    'federated login'
  ];
  validEvents.forEach(function(e) {
    instance.on(e, function() {
      var args = arguments;
      if (arguments.length === 1) {
        args = arguments[0];
      }
      logs.push({ event: e, arguments: args });
      printLogs();
    });
  });
}

var clientId = '6qgR882b0vAiuTwsI6NZC9zynrUVF0mQ';
var domain = 'auth.brucke.club';
var defaultOptions = {
  allowLogin: true,
  allowSignUp: true,
  allowForgotPassword: true,
  closable: true,
  allowedConnections: null,
  rememberLastLogin: false,
  hashCleanup: false,
  mustAcceptTerms: false,
  defaultADUsernameFromEmailPrefix: false,
  // socialButtonStyle: 'small',
  configurationBaseUrl: 'https://cdn.auth0.com',
  prefill: {
    email: 'johnfoo@gmail.com'
  }
};
var webAuth = new auth0.WebAuth({
  domain: domain,
  redirectUri: 'https://brucke.club/',
  clientID: clientId,
  responseType: 'token'
});
var webAuthWithoutCustomDomains = new auth0.WebAuth({
  domain: 'brucke.auth0.com',
  redirectUri: 'https://brucke.club/',
  clientID: clientId,
  responseType: 'token'
});

function initLock() {
  var lock = new Auth0Lock(clientId, domain, defaultOptions);
  window.localStorage.lastUsed = 'lock';
  subscribeToEvents(lock);
  return lock;
}
function initPasswordless() {
  var lockPasswordless = new Auth0LockPasswordless(
    clientId,
    domain,
    Object.assign({}, defaultOptions, { socialButtonStyle: 'small', allowedConnections: ['sms'] })
  );
  window.localStorage.lastUsed = 'passwordless';
  subscribeToEvents(lockPasswordless);
  return lockPasswordless;
}
$(function() {
  printLogs();
  $('#btn-clear-log').on('click', clearLogs);
  $('#btn-show-lock').on('click', function() {
    clearLogs();
    var lock = initLock();
    lock.show({
      allowLogin: true,
      allowSignUp: true,
      allowForgotPassword: true,
      initialScreen: 'login',
      languageDictionary: {
        title: 'Lock'
      }
    });
  });
  $('#btn-show-lock-huge-signup').on('click', function() {
    clearLogs();
    var lock = new Auth0Lock(
      clientId,
      domain,
      Object.assign({}, defaultOptions, {
        autofocus: false,
        allowLogin: true,
        allowSignUp: true,
        allowForgotPassword: true,
        initialScreen: 'signUp',
        prefill: { email: 'johnfoo@gmail.com' },
        languageDictionary: {
          title: 'Lock'
        },
        additionalSignUpFields: [
          {
            name: 'address',
            placeholder: 'enter your address (optional)',
            validator: function() {
              return true;
            }
          },
          {
            name: 'address221',
            placeholder: 'enter your address (optional)',
            validator: function() {
              return true;
            }
          },
          {
            name: 'address1',
            placeholder: 'enter your address (optional)',
            validator: function() {
              return true;
            }
          },
          {
            name: 'address2',
            placeholder: 'enter your address (optional)',
            validator: function() {
              return true;
            }
          },
          {
            name: 'address3',
            placeholder: 'enter your address (optional)',
            validator: function() {
              return true;
            }
          },
          {
            name: 'address4',
            placeholder: 'enter your address (optional)',
            validator: function() {
              return true;
            }
          },
          {
            name: 'address45',
            placeholder: 'enter your address (optional)',
            validator: function() {
              return true;
            }
          },
          {
            name: 'address6',
            placeholder: 'enter your address (optional)',
            validator: function() {
              return true;
            }
          },
          {
            name: 'address7',
            placeholder: 'enter your address (optional)',
            validator: function() {
              return true;
            }
          }
        ]
      })
    );
    window.localStorage.lastUsed = 'lock';
    subscribeToEvents(lock);
    lock.show();
  });
  $('#btn-show-passwordless').on('click', function() {
    clearLogs();
    var lockPasswordless = initPasswordless();
    lockPasswordless.show({
      languageDictionary: {
        title: 'Passwordless'
      }
    });
  });
  $('#btn-ulp').on('click', function() {
    clearLogs();
    window.localStorage.lastUsed = 'a0js';
    webAuth.authorize({});
  });
  $('#btn-ulp-no-cname').on('click', function() {
    clearLogs();
    window.localStorage.lastUsed = 'a0js';
    webAuthWithoutCustomDomains.authorize({});
  });
  $('#btn-ulp-popup').on('click', function() {
    clearLogs();
    window.localStorage.lastUsed = 'a0js';
    webAuth.popup.authorize({ scope: 'offline_access' });
  });
  $('#btn-ulp-no-cname-popup').on('click', function() {
    clearLogs();
    window.localStorage.lastUsed = 'a0js';
    webAuthWithoutCustomDomains.popup.authorize({});
  });
  $('#btn-checksession').on('click', function() {
    webAuth.checkSession({}, function(err, authResult) {
      logs.push({ event: 'a0js_parse_hash', arguments: [err, authResult] });
      printLogs();
    });
  });
  $('#btn-checksession-no-cname').on('click', function() {
    webAuthWithoutCustomDomains.checkSession({}, function(err, authResult) {
      logs.push({ event: 'a0js_parse_hash', arguments: [err, authResult] });
      printLogs();
    });
  });
  $('#btn-newsdk-popup').on('click', function () {
    createAuth0Client({
      domain: 'auth.brucke.club',
      client_id: '6qgR882b0vAiuTwsI6NZC9zynrUVF0mQ'
    }).then(function (auth0) {
      auth0.loginWithPopup().then(function () {
        auth0.getUser().then(function (user) {
          logs.push({ event: 'newsdk_login_success', arguments: [user] });
          printLogs();
        });
      })
    }).catch(function (err) {
        logs.push({ event: 'newsdk_login_error', arguments: [err] });
        printLogs();
      });;
  });

  $('#a0js-form').on('submit', function(e) {
    e.preventDefault();
    clearLogs();
    window.localStorage.lastUsed = 'a0js';
    webAuth.login({
      username: $('#email').val(),
      password: $('#password').val(),
      realm: 'acme'
    });
  });
  //make sure we initialize Lock so we can parse the hash
  var lastUsed = window.localStorage.lastUsed;
  if (!lastUsed) {
    return;
  }
  switch (lastUsed) {
    case 'lock':
      initLock();
      break;
    case 'passwordless':
      initPasswordless();
      break;
    case 'a0js':
      webAuth.parseHash(function(err, authResult) {
        logs.push({ event: 'a0js_parse_hash', arguments: [err, authResult] });
        printLogs();
        window.location.hash = '';
      });
      break;
    default:
      break;
  }
  window.localStorage.removeItem('lastUsed');
});
