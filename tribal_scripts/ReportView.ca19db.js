var ReportView;
!(function () {
  'use strict';
  ReportView = {
    BuddyRequest: {
      init: function () {
        $('#reject_buddy').click(function () {
          ReportView.BuddyRequest.confirmReject($(this).data('id'));
        });
      },
      confirmReject: function (e) {
        var t = _('85ca9fe82717848c8a0d369403f73d1d');
        UI.addConfirmBox(t, function () {
          ReportView.BuddyRequest.reject(e);
        });
      },
      reject: function (e) {
        TribalWars.post('buddies', { ajaxaction: 'reject_buddy', buddy_id: e }, {}, function () {
          partialReload(), UI.SuccessMessage(_('43e7650efbe98b140bf0e27a242dbe15'));
        });
      },
    },
    AllyInvite: {
      init: function () {
        $('#reject_invite').click(function () {
          ReportView.AllyInvite.confirmReject($(this).data('id'));
        });
      },
      confirmReject: function (e) {
        var t = _('40368688d2a4c3c767177828269c8d1a');
        UI.addConfirmBox(t, function () {
          ReportView.AllyInvite.reject(e);
        });
      },
      reject: function (e) {
        TribalWars.post('ally', { ajaxaction: 'reject_invite', id: e }, {}, function () {
          partialReload(), UI.SuccessMessage(_('70472b8bb3cc6e3f1bddfba6836a2232'));
        });
      },
    },
  };
})();
