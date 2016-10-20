
/*:

 * @requiredAssets audio/se/gun-ready01
 * @requiredAssets audio/se/pi
 * @requiredAssets audio/se/gun-fire03
 * @requiredAssets audio/se/Attack1
 * @requiredAssets audio/se/Attack2
 * @requiredAssets audio/se/Attack3
 * @requiredAssets audio/se/Explosion1
 * @requiredAssets img/system/Shot2
 * @requiredAssets img/system/Shot3
*/
var patchforthisgame = {};
patchforthisgame.switchse = {
	name: "gun-ready01",
	volume: 150,
	pitch: 100
}
patchforthisgame.machinegun = {
	name: "pi",
	volume: 130,
	pitch: 100
}
patchforthisgame.shotgun = {
	name: "gun-fire03",
	volume: 300,
	pitch: 100
}
patchforthisgame.splitgunfire = {
	name: "Attack2",
	volume: 90,
	pitch: 100
}
patchforthisgame.splitgunsplit = {
	name: "Explosion1",
	volume: 90,
	pitch: 100
}
patchforthisgame.stage1 = {
	name: "Attack3",
	volume: 20,
	pitch: 80
}
patchforthisgame.stage3 = {
	name: "Attack1",
	volume: 30,
	pitch: 80
}
patchforthisgame.weaponstart = 1;
patchforthisgame.maxweapons = 3;
patchforthisgame.movespeed = [1];
patchforthisgame.attackspeed = [2];
patchforthisgame.projectilespeed = [7];
patchforthisgame.switchspeed = [8];
patchforthisgame.projectileamount = [9];
patchforthisgame.projectilespread = [10];
patchforthisgame.projectilepierce = [11];

patchforthisgame.gameshootingplayerinitialize = Game_ShootingPlayer.prototype.initialize;
Game_ShootingPlayer.prototype.initialize = function() {
	patchforthisgame.gameshootingplayerinitialize.call(this);
	this._equiping = $gameParty.leader().weapons()[0].id - patchforthisgame.weaponstart;
}

patchforthisgame.gameshootingplayerupdate = Game_ShootingPlayer.prototype.update;
Game_ShootingPlayer.prototype.update = function() {
	patchforthisgame.gameshootingplayerupdate.call(this);
	this.updateWeaponSwitch();
}

patchforthisgame.gameshootingplayerupdateattack = Game_ShootingPlayer.prototype.updateAttack;
Game_ShootingPlayer.prototype.updateAttack = function() {
	patchforthisgame.gameshootingplayerupdateattack.call(this);
	if ($gameParty.hasItem($dataItems[patchforthisgame.attackspeed[0]])){
    	this._waitCount = Math.max(this._waitCount - 0.2, 0);
    }
}

Game_ShootingPlayer.prototype.updateWeaponSwitch = function() {
	var threshold = 20;
	if (Input.isTriggered('pageup') || TouchInput.wheelY <= -threshold) {
		this._equiping = ((this._equiping - 1) + patchforthisgame.maxweapons) % patchforthisgame.maxweapons;
		AudioManager.playSe(patchforthisgame.switchse);
		$gameParty.leader().forceChangeEquip(0, $dataWeapons[this._equiping+patchforthisgame.weaponstart]);
		this._waitCount = 15;
		if ($gameParty.hasItem($dataItems[patchforthisgame.switchspeed[0]])) {
			this._waitCount -= 3;
		}
	} else if (Input.isTriggered("pagedown") || TouchInput.wheelY >= threshold) {
		this._equiping = ((this._equiping + 1) + patchforthisgame.maxweapons) % patchforthisgame.maxweapons;
		AudioManager.playSe(patchforthisgame.switchse);
		$gameParty.leader().forceChangeEquip(0, $dataWeapons[this._equiping+patchforthisgame.weaponstart]);
		this._waitCount = 15;
		if ($gameParty.hasItem($dataItems[patchforthisgame.switchspeed[0]])) {
			this._waitCount -= 3;
		}
	}
}

Game_ShootingPlayer.prototype.machineGunAttackFunc = function() {
    var initFunc = function(proj) {
        this.setProjectileProperty(proj);
        var scatter = Math.PI/9;
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[0]])) {
        	scatter *= 0.95;
        }
        proj._vec.turn(Math.random()*scatter - scatter/2);
        proj._vec.setMagnitude(0.125);
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[0]])) {
        	proj._vec.applyMagnitude(1.05);
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[0]])) {
        	if (Math.random() <= 0.1) {
        		proj._pierce++;
        	}
        }
    }.bind(this);
    this.addProjectile("Game_ShootingProjectileStraight", initFunc);
	if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[0]])) {
		if (Math.random() <= 0.2) {
    		this.addProjectile("Game_ShootingProjectileStraight", initFunc);
		}
	}
	AudioManager.playSe(patchforthisgame.machinegun);
    this._waitCount = 5;
}

Game_ShootingPlayer.prototype.shotGunAttackFunc = function() {
    var initFunc = function(proj) {
        this.setProjectileProperty(proj);
        proj._vec.setMagnitude(Math.random() * 0.1 + 0.06);
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[0]])) {
        	proj._vec.applyMagnitude(1.05);
        }
        var scatter = Math.PI/6;
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[0]])) {
        	scatter *= 0.95;
        }
        proj._vec.turn(Math.random()*scatter - scatter/2);
        proj._projectileHue = Math.random() * 360;
        proj._damage *= 0.85;
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[0]])) {
        	if (Math.random() <= 0.1) {
        		proj._pierce++;
        	}
        }
    }.bind(this);
    var max = 15;
	if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[0]])) {
		max = Math.round(max * 1.2);
	}
    for (var n = 0; n < max; n++) {
        this.addProjectile("Game_ShootingProjectileStraight", initFunc);
    }
	AudioManager.playSe(patchforthisgame.shotgun);
    this._waitCount = 60;
}

Game_ShootingPlayer.prototype.splitGunAttackFunc = function() {
    var initFunc = function(proj) {
        proj.childFunc = function(proj2, args) {
            this.setProjectileProperty(proj2);
            proj2.setAngle(args[0], args[1]);
            proj._damage *= 0.15;
        	if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[0]])) {
	        	proj._vec.applyMagnitude(1.05);
	        }
        	if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[0]])) {
	        	if (Math.random() <= 0.1) {
	        		proj._pierce++;
	        	}
	        }
        };
        this.setProjectileProperty(proj);
        proj._projectileName = "Shot3";
        proj._damage *= 0.4;
        proj._vec.setMagnitude(0.125);
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[0]])) {
	       	proj._vec.applyMagnitude(1.05);
	    }
        proj._acc = proj._vec.clone().applyMagnitude(-0.01);
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[0]])) {
        	proj._acc.applyMagnitude(0.95);
        }
        proj.oldUpdateMovement = proj.updateMovement;
        proj.updateMovement = function() {
        	proj.oldUpdateMovement();
        	if (this._vec.magnitude <= 0.001) {
        		this._vec.setMagnitude(0);
        	}
        }
        proj.onFinish = function() {
        	var dif = 20;
			if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[0]])) {
				dif /= 1.2;
			}
            for (var n = 0; n <= 360; n += dif) {
                this.addProjectile("Game_ShootingProjectileStraight", this.childFunc.bind(this), Math.deg2Rad(n), 0.1);
            }
            AudioManager.playSe(patchforthisgame.splitgunsplit);
        }.bind(proj);
        proj._pierce = 2;
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[0]])) {
        	if (Math.random() <= 0.1) {
        		proj._pierce++;
        	}
        }
    }.bind(this);
    this.addProjectile("Game_ShootingProjectileStraight", initFunc);
    AudioManager.playSe(patchforthisgame.splitgunfire);
    this._waitCount = 60;
}

Game_ShootingEnemy.prototype.stage1Enemy = function() {
    this._waitCount = this._waitCount || 0;
    this._angle = this._angle || 0;
    this._playerTarget = this._playerTarget !== undefined ? this._playerTarget : 4;
    if (this._waitCount == 0) {
		var initFunc1 = function(proj) {
			this.setProjectileProperty(proj);
			proj.setTarget(BattleManager.player, 0.05);
			proj._projectileHue = 180;
		}
		var initFunc2 = function(proj, args) {
			this.setProjectileProperty(proj);
			proj._damage *= 0.5;
			proj.setAngle(Math.deg2Rad(args[0]), 0.025);
		}
		if (this._playerTarget == 0) {
			this.addProjectile("Game_ShootingProjectileStraight", initFunc1);
			AudioManager.playSe(patchforthisgame.stage1);
			this._playerTarget = 2;
		} else {
			this._playerTarget--;
		}
		for (var ang = this._angle; ang <= 360 + this._angle; ang += 30) {
			this.addProjectile("Game_ShootingProjectileStraight", initFunc2, ang);
		}
		this._angle = (this._angle + 1) % 360;
		this._waitCount = 20;
    } else {
    	this._waitCount--;
    }

}

Game_ShootingEnemy.prototype.stage2Enemy = function() {
    this._waitCount = this._waitCount || 0;
    this._angle = this._angle || 0;
    this._shootCount = this._shootCount || 0;
    if (this._waitCount == 0) {
		var initFunc2 = function(proj, args) {
			this.setProjectileProperty(proj);
			proj._damage *= 0.5;
			proj.setTarget(BattleManager.player, 0, 0, Math.deg2Rad(0.1));
			proj.setAngle(Math.deg2Rad(args[0]), 0.035);
		}
		this.addProjectile("Game_ShootingProjectileFollow", initFunc2, this._angle);
		this.addProjectile("Game_ShootingProjectileFollow", initFunc2, (this._angle+180) % 360);
		this._angle = (this._angle + 11) % 360;
		this._waitCount = 5;
		this._shootCount++;
		if (this._shootCount == 20) {
			this._waitCount = 60;
			this._shootCount = 0;
		}
    } else {
    	this._waitCount--;
    }

}

Game_ShootingEnemy.prototype.stage3Enemy = function() {
    this._waitCount = this._waitCount || 0;
    this._angle = this._angle || 0;
    if (this._waitCount == 0) {
		var initFunc2 = function(proj, args) {
			this.setProjectileProperty(proj);
			proj._damage *= 0.5;
			proj.setAngle(-Math.deg2Rad(args[0]), 0.035);
		}
		this.addProjectile("Game_ShootingProjectileStraight", initFunc2, (this._angle > 180 ? this._angle : 360-this._angle));
		this._angle = (this._angle + 11) % 360;
		this._waitCount = 5;
    } else {
    	this._waitCount--;
    }

}

Game_ShootingEnemy.prototype.stage4Enemy = function() {
    this._waitCount = this._waitCount || 0;
    this._angle = this._angle || 0;
    this._phase = this._phase || 0;
    this._shotCount = this._shotCount || 0;
    if (this._waitCount == 0) {
    	switch(this._phase) {
    		case 0:
    		var func = function(proj) {
    			this.setProjectileProperty(proj);
    			proj.setTarget(BattleManager.player, 0.035, Math.random() * Math.deg2Rad(30) - Math.deg2Rad(15));
   				proj._damage *= 0.8;
   			}
   			this.addProjectile("Game_ShootingProjectileStraight", func);
   			if (!this._played) {
   				AudioManager.playSe(patchforthisgame.stage3);
   				this._played = true;
   			}
   			this._waitCount = 6;
    		this._shotCount++;
    		if (this._shotCount >= 40) {
    			this._phase = 1;
    			this._shotCount = 0;
   				this._waitCount = 120;
   				this._played = false;
   			}
    		break;
    		case 1:
    		var func = function(proj, args) {
    			this.setProjectileProperty(proj);
    			proj.setTarget(BattleManager.player, 0.05, args[0]);
   				proj._damage *= 0.8;
   			}
   			for (var ang = -45; ang <= 45; ang += 15) {
   				this.addProjectile("Game_ShootingProjectileStraight", func, Math.deg2Rad(ang));
   			}
   			this._waitCount = 25;
   			this._shotCount++;
   			if (!this._played) {
   				AudioManager.playSe(patchforthisgame.stage3);
   				this._played = true;
   			}
    		if (this._shotCount >= 15) {
    			this._phase = 2;
    			this._shotCount = 0;
   				this._waitCount = 120;
   				this._angle = 0;
   				this._initAngle = undefined;
   				this._played = false;
   			}
   			break;
   			case 2:
   			this._initAngle = this._initAngle !== undefined ? this._initAngle : this.getPlayerVector().angleBetween(Kien.Vector2D.xUnitVector);
    		var func = function(proj, args) {
    			this.setProjectileProperty(proj);
    			proj.setAngle(this._initAngle, 0.05, args[0]);
   				proj._damage *= 0.8;
   			}
   			this.addProjectile("Game_ShootingProjectileStraight",func, Math.deg2Rad(((this._angle > 90 ? 180 - this._angle : this._angle) - 45)));
   			this._waitCount = 6;
   			this._angle = (this._angle + 6) % 180;
   			this._shotCount++;
   			if (!this._played) {
   				AudioManager.playSe(patchforthisgame.stage3);
   				this._played = true;
   			}
    		if (this._shotCount >= 40) {
    			this._phase = 0;
    			this._shotCount = 0;
   				this._waitCount = 180;
   				this._angle = 0;
   				this._played = false;
   			}
    	}
    } else {
    	this._waitCount--;
    }

}


BattleManager.setup = function(troopId, canEscape, canLose) {
	Kien.ShootingRPG.BattleManager_setup.apply(this, arguments);
	if ($gameSystem._shootingRPGEnabled) {
        if (!this._shootingPlayer) {
            this._shootingPlayer = new Game_Player();
            this._shootingPlayer._direction = 8;
            this._shootingPlayer._directionFix = true;
            this._shootingPlayer.setTransparent(false);
            this._shootingPlayer.isDashing = function() {return true};
            this._shootingPlayer._shootingOrigDPF = this._shootingPlayer.distancePerFrame;
			this._shootingPlayer.distancePerFrame = function() {
				var d = this._shootingOrigDPF();
				if ($gameParty.hasItem($dataItems[patchforthisgame.movespeed[0]])){
					d *= 1.05;
				}
				return d;
			};
        }
        if (!this._shootingMap) {
            this._shootingMap = new Game_Map();
        }
        this._shootingPlayer.refresh();
        DataManager._reservedGameMap = $gameMap;
        DataManager._reservedGamePlayer = $gamePlayer;
        DataManager._reservedMap = $dataMap;
		DataManager.loadMapData($gameSystem._shootingRPGBattleMapId);
        $dataMap = DataManager._reservedMap;
	}
};

//-----------------------------------------------------------------------------
// Sprite_ShootingWeaponName
//
// The sprite for displaying score.

function Sprite_ShootingWeaponName() {
    this.initialize.apply(this, arguments);
}

Sprite_ShootingWeaponName.prototype = Object.create(Sprite_Base.prototype);
Sprite_ShootingWeaponName.prototype.constructor = Sprite_ShootingWeaponName;

Sprite_ShootingWeaponName.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this._currentItem = null;
    this.createBitmap();
}

Sprite_ShootingWeaponName.prototype.createBitmap = function() {
	this.bitmap = new Bitmap(144, 36);
}

Sprite_ShootingWeaponName.prototype.update = function() {
	Sprite_Base.prototype.update.call(this);
	this.updateWeaponName();
}

Sprite_ShootingWeaponName.prototype.updateWeaponName = function() {
	if ($gameParty.leader().weapons()[0] != this._currentItem) {
		this._currentItem = $gameParty.leader().weapons()[0];
		this.bitmap.clear();
		var iconIndex = this._currentItem.iconIndex;
	    var bitmap = ImageManager.loadSystem('IconSet');
	    var pw = Window_Base._iconWidth;
	    var ph = Window_Base._iconHeight;
	    var sx = iconIndex % 16 * pw;
	    var sy = Math.floor(iconIndex / 16) * ph;
	    this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
		this.bitmap.drawText(this._currentItem.name, pw + 4, 0, 144 - pw - 4, 36);
	}
}

patchforthisgame.spritesetshootingcreateupperlayer = Spriteset_Shooting.prototype.createUpperLayer;
Spriteset_Shooting.prototype.createUpperLayer = function() {
	patchforthisgame.spritesetshootingcreateupperlayer.call(this);
	this.createWeaponNameSprite();
};

Spriteset_Shooting.prototype.createWeaponNameSprite = function() {
	this._weaponNameSprite = new Sprite_ShootingWeaponName();
	this._weaponNameSprite.y = Graphics._height - this._weaponNameSprite.height;
	this.addChild(this._weaponNameSprite);
}