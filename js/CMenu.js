function CMenu() {
  var _oBg;
  var _oButPlay;
  var _oFade;
  var _oAudioToggle;
  var _oCreditsBut;
  var _oButFullscreen;
  var _oButDelete;

  //variables para la nueva pantallade inicio
  var _oBgNew;
  var _obutStartNew;
  var _oLogoNew;
  var _oAbbottNew;
  var _pStartPosButStartNew;
  var _oLeyendaNew;

  var _fRequestFullScreen = null;
  var _fCancelFullScreen = null;

  var _pStartPosAudio;
  var _pStartPosCredits;
  var _pStartPosFullscreen;
  var _pStartPosDelete;

  this._init = function () {
    //pantalla de inicio
    _oBgNew = createBitmap(s_oSpriteLibrary.getSprite("bg_inicio"));
    s_oStage.addChild(_oBgNew);

    var _oSpriteNew = s_oSpriteLibrary.getSprite("logo_inicio");
    _oLogoNew = createBitmap(_oSpriteNew);
    _oLogoNew.regX = _oSpriteNew.width / 2;
    _oLogoNew.regY = _oSpriteNew.height / 2;
    _oLogoNew.x = CANVAS_WIDTH / 2;
    _oLogoNew.y = CANVAS_HEIGHT / 2 - 100;
    s_oStage.addChild(_oLogoNew);

    var _oSpriteNew = s_oSpriteLibrary.getSprite("abbot");
    _oAbbottNew = createBitmap(_oSpriteNew);
    _oAbbottNew.regX = _oSpriteNew.width / 2;
    _oAbbottNew.regY = _oSpriteNew.height / 2;
    _oAbbottNew.x = _oSpriteNew.width / 1.5;
    _oAbbottNew.y = _oSpriteNew.height * 2;
    s_oStage.addChild(_oAbbottNew);

    //añadimos la leyenda a la pantalla de inicio
    var _oSpriteNew = s_oSpriteLibrary.getSprite("leyenda_inicio");
    _oLeyendaNew = createBitmap(_oSpriteNew);
    _oLeyendaNew.regX = _oSpriteNew.width / 2;
    _oLeyendaNew.regY = _oSpriteNew.height / 2;
    _oLeyendaNew.x = CANVAS_WIDTH - _oSpriteNew.width;
    _oLeyendaNew.y = CANVAS_HEIGHT - _oSpriteNew.height * 8;
    s_oStage.addChild(_oLeyendaNew);

    var oSprite = s_oSpriteLibrary.getSprite("but_inicio");
    _pStartPosButStartNew = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2 + 200,
    };
    _obutStartNew = new CGfxButton(
      _pStartPosButStartNew.x,
      _pStartPosButStartNew.y,
      oSprite,
      s_oStage,
    );
    _obutStartNew.addEventListener(ON_MOUSE_UP, this.loadNextWindow, this);
    _obutStartNew.pulseAnimation();
  };

  //cargar la siguiente ventana
  this.loadNextWindow = function () {
    //se quitar los objetos añadidos en el _init
    s_oStage.removeChild(_oBgNew);
    s_oStage.removeChild(_oLogoNew);
    s_oStage.removeChild(_oAbbottNew);
    s_oStage.removeChild(_oLeyendaNew);
    _oBgNew = null;
    _oLogoNew = null;
    _oAbbottNew = null;
    _oLeyendaNew = null;

    _obutStartNew.visible = false;
    _obutStartNew = null;

    // Implement the logic to load the next window here
    _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    s_oStage.addChild(_oBg);

    var oSprite = s_oSpriteLibrary.getSprite("but_play");
    _oButPlay = new CGfxButton(
      CANVAS_WIDTH / 2 + 350,
      CANVAS_HEIGHT / 2 - 40,
      oSprite,
      s_oStage,
    );
    _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
    _oButPlay.pulseAnimation();

    var oSprite = s_oSpriteLibrary.getSprite("logo_menu");
    var oLogo = createBitmap(oSprite);
    oLogo.regX = oSprite.width / 2;
    oLogo.regY = oSprite.height / 2;
    oLogo.x = CANVAS_WIDTH / 2;
    oLogo.y = CANVAS_HEIGHT / 2 - 200;
    s_oStage.addChild(oLogo);

    var oSprite = s_oSpriteLibrary.getSprite("but_credits");
    _pStartPosCredits = {
      x: oSprite.width / 2 + 12,
      y: oSprite.height / 2 + 16,
    };
    _oCreditsBut = new CGfxButton(
      _pStartPosCredits.x,
      _pStartPosCredits.y,
      oSprite,
      s_oStage,
    );
    _oCreditsBut.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);

    var iX = CANVAS_WIDTH;
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      var oSprite = s_oSpriteLibrary.getSprite("audio_icon");
      _pStartPosAudio = {
        x: CANVAS_WIDTH - oSprite.width / 4 - 12,
        y: oSprite.height / 2 + 16,
      };
      _oAudioToggle = new CToggle(
        _pStartPosAudio.x,
        _pStartPosAudio.y,
        oSprite,
        s_bAudioActive,
      );
      _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);

      iX = _pStartPosAudio.x - oSprite.width / 4;
    }

    if (s_oLocalStorage.isDirty()) {
      var oSprite = s_oSpriteLibrary.getSprite("but_delete_saving");
      _pStartPosDelete = {
        x: iX - oSprite.width / 2 - 12,
        y: oSprite.height / 2 + 16,
      };
      _oButDelete = new CGfxButton(
        _pStartPosDelete.x,
        _pStartPosDelete.y,
        oSprite,
        s_oStage,
      );
      _oButDelete.addEventListener(ON_MOUSE_UP, this._onDeleteBut, this);
    }

    var doc = window.document;
    var docEl = doc.documentElement;
    _fRequestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    _fCancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (ENABLE_FULLSCREEN === false) {
      _fRequestFullScreen = false;
    }

    if (_fRequestFullScreen && screenfull.isEnabled) {
      oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
      _pStartPosFullscreen = {
        x: _pStartPosCredits.x + oSprite.width / 2 + 12,
        y: oSprite.height / 2 + 16,
      };
      _oButFullscreen = new CToggle(
        _pStartPosFullscreen.x,
        _pStartPosFullscreen.y,
        oSprite,
        s_bFullscreen,
        s_oStage,
      );
      _oButFullscreen.addEventListener(
        ON_MOUSE_UP,
        this._onFullscreenRelease,
        this,
      );
    }

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    s_oStage.addChild(_oFade);

    createjs.Tween.get(_oFade)
      .to({ alpha: 0 }, 1000)
      .call(function () {
        _oFade.visible = false;
      });

    this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

    if (!s_oLocalStorage.isUsed()) {
      new CMsgBox(TEXT_IOS_PRIVATE);
    }
  };

  this.unload = function () {
    _oButPlay.unload();
    _oButPlay = null;
    _oFade.visible = false;

    _oCreditsBut.unload();
    if (_oButDelete && s_oLocalStorage.isDirty()) {
      _oButDelete.unload();
    }
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.unload();
      _oAudioToggle = null;
    }

    if (_fRequestFullScreen && screenfull.isEnabled) {
      _oButFullscreen.unload();
    }

    s_oStage.removeChild(_oBg);
    _oBg = null;
    s_oMenu = null;
  };

  this.refreshButtonPos = function (iNewX, iNewY) {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.setPosition(
        _pStartPosAudio.x - iNewX,
        iNewY + _pStartPosAudio.y,
      );
    }
    _oCreditsBut.setPosition(
      _pStartPosCredits.x + iNewX,
      iNewY + _pStartPosCredits.y,
    );
    if (_fRequestFullScreen && screenfull.isEnabled) {
      _oButFullscreen.setPosition(
        _pStartPosFullscreen.x + iNewX,
        _pStartPosFullscreen.y + iNewY,
      );
    }
    if (_oButDelete && s_oLocalStorage.isDirty()) {
      _oButDelete.setPosition(
        _pStartPosDelete.x - iNewX,
        _pStartPosDelete.y + iNewY,
      );
    }
  };

  this.resetFullscreenBut = function () {
    if (_fRequestFullScreen && screenfull.isEnabled) {
      _oButFullscreen.setActive(s_bFullscreen);
    }
  };

  this._onFullscreenRelease = function () {
    if (s_bFullscreen) {
      _fCancelFullScreen.call(window.document);
    } else {
      _fRequestFullScreen.call(window.document.documentElement);
    }

    sizeHandler();
  };

  this._onCreditsBut = function () {
    new CCreditsPanel();
  };

  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
  };

  this._onDeleteBut = function () {
    var oPanel = new CAreYouSurePanel(s_oMenu.deleteSavings);
    oPanel.changeMessage(TEXT_SAVE_REMOVE, 24);
  };

  this.deleteSavings = function () {
    s_oLocalStorage.deleteData();
    s_oLocalStorage.resetData();
    _oButDelete.unload();
  };

  this._onButPlayRelease = function () {
    this.unload();

    $(s_oMain).trigger("start_session");

    s_oMain.gotoWorldMenu();
  };

  s_oMenu = this;

  this._init();
}

var s_oMenu = null;
