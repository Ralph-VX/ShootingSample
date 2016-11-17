
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
	volume: 70,
	pitch: 100
}
patchforthisgame.shotgun = {
	name: "gun-fire03",
	volume: 110,
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
patchforthisgame.movespeed = [1,13,25];
patchforthisgame.attackspeed = [2,14, 26];
patchforthisgame.projectilespeed = [7,19, 31];
patchforthisgame.switchspeed = [8,20, 32];
patchforthisgame.projectileamount = [9,21, 33];
patchforthisgame.projectilespread = [10,22, 34];
patchforthisgame.projectilepierce = [11,23, 35];

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
	if ($gameParty.hasItem($dataItems[patchforthisgame.attackspeed[1]])){
    	this._waitCount = Math.max(this._waitCount - 0.3, 0);
    }
	if ($gameParty.hasItem($dataItems[patchforthisgame.attackspeed[2]])){
    	this._waitCount = Math.max(this._waitCount - 0.3, 0);
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
		if ($gameParty.hasItem($dataItems[patchforthisgame.switchspeed[1]])) {
			this._waitCount -= 3;
		}
		if ($gameParty.hasItem($dataItems[patchforthisgame.switchspeed[2]])) {
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
		if ($gameParty.hasItem($dataItems[patchforthisgame.switchspeed[1]])) {
			this._waitCount -= 3;
		}
		if ($gameParty.hasItem($dataItems[patchforthisgame.switchspeed[2]])) {
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
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[1]])) {
        	scatter *= 0.95;
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[2]])) {
        	scatter *= 0.95;
        }
        proj._vec.turn(Math.random()*scatter - scatter/2);
        proj._vec.setMagnitude(0.125);
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[0]])) {
        	proj._vec.applyMagnitude(1.05);
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[1]])) {
        	proj._vec.applyMagnitude(1.075);
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[2]])) {
        	proj._vec.applyMagnitude(1.1);
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[0]])) {
        	if (Math.random() <= 0.1) {
        		proj._pierce++;
        	}
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[1]])) {
        	if (Math.random() <= 0.15) {
        		proj._pierce++;
        	}
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[2]])) {
        	if (Math.random() <= 0.2) {
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
	if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[1]])) {
		if (Math.random() <= 0.3) {
    		this.addProjectile("Game_ShootingProjectileStraight", initFunc);
		}
	}
	if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[2]])) {
		if (Math.random() <= 0.35) {
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
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[1]])) {
        	proj._vec.applyMagnitude(1.075);
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[2]])) {
        	proj._vec.applyMagnitude(1.1);
        }
        var scatter = Math.PI/6;
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[0]])) {
        	scatter *= 0.95;
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[1]])) {
        	scatter *= 0.95;
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[2]])) {
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
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[1]])) {
        	if (Math.random() <= 0.15) {
        		proj._pierce++;
        	}
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[2]])) {
        	if (Math.random() <= 0.2) {
        		proj._pierce++;
        	}
        }
    }.bind(this);
    var max = 15;
	if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[0]])) {
		max = Math.round(max * 1.2);
	}
	if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[1]])) {
		max = Math.round(max * 1.3);
	}
	if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[2]])) {
		max = Math.round(max * 1.35);
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
        	if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[0]])) {
	        	proj2._vec.applyMagnitude(1.05);
	        }
        	if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[1]])) {
	        	proj2._vec.applyMagnitude(1.075);
	        }
        	if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[2]])) {
	        	proj2._vec.applyMagnitude(1.1);
	        }
	        proj2.isValid = function() {
        		return Math.sqrt((Math.pow(this.realX(), 2) + Math.pow(this.realY(), 2))) < 100;
        	}.bind(proj2);
        	if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[0]])) {
	        	if (Math.random() <= 0.1) {
	        		proj2._pierce++;
	        	}
	        }
        	if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[1]])) {
	        	if (Math.random() <= 0.15) {
	        		proj2._pierce++;
	        	}
	        }
        	if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[2]])) {
	        	if (Math.random() <= 0.2) {
	        		proj2._pierce++;
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
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[1]])) {
	       	proj._vec.applyMagnitude(1.075);
	    }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespeed[2]])) {
	       	proj._vec.applyMagnitude(1.1);
	    }
        proj._acc = proj._vec.clone().applyMagnitude(-0.01);
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[0]])) {
        	proj._acc.applyMagnitude(0.95);
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[1]])) {
        	proj._acc.applyMagnitude(0.95);
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilespread[2]])) {
        	proj._acc.applyMagnitude(0.95);
        }
        proj.isValid = function() {
        	return Math.sqrt((Math.pow(this.realX(), 2) + Math.pow(this.realY(), 2))) < 100;
        }.bind(proj);
        proj.oldUpdateMovement = proj.updateMovement;
        proj.updateMovement = function() {
        	proj.oldUpdateMovement();
        	if (this._vec.magnitude <= 0.001) {
        		this._vec.setMagnitude(0);
        	}
        }
        proj.onFinish = function() {
        	if (this._pierce == 0) {
        		return;
        	}
        	var dif = 20;
			if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[0]])) {
				dif /= 1.2;
			}
			if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[1]])) {
				dif /= 1.3;
			}
			if ($gameParty.hasItem($dataItems[patchforthisgame.projectileamount[2]])) {
				dif /= 1.35;
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
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[1]])) {
        	if (Math.random() <= 0.15) {
        		proj._pierce++;
        	}
        }
        if ($gameParty.hasItem($dataItems[patchforthisgame.projectilepierce[2]])) {
        	if (Math.random() <= 0.15) {
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

Game_ShootingEnemy.prototype.stage6Enemy = function() {
    this._waitCount = this._waitCount || 0;
    if (this._waitCount == 0) {
		var initFunc = function(proj, args) {
			this.setProjectileProperty(proj);
			proj._vec.x = 0;
			proj._vec.y = 1;
			proj._vec.setMagnitude(0.02);
			proj.setPosition(proj.x + args[0], proj.y);
			proj._damage *= 0.5;
		}
		var dif = 0.35;
		dif -= (0.35 - 0.2) * (1 - this._enemy.hpRate());
		for (var dx = -2; dx <= 2; dx += dif) {
			this.addProjectile("Game_ShootingProjectileStraight", initFunc, dx);
		}
		this._waitCount = 25;
    } else {
    	this._waitCount--;
    }
}

Game_ShootingEnemy.prototype.stage7Init = function() {
	this._waitCount = 60 * this._enemy.index();
	this._shotCount = 0;
}

Game_ShootingEnemy.prototype.stage7Enemy = function() {
    if (this._waitCount == 0) {
		var initFunc = function(proj, args) {
			this.setProjectileProperty(proj);
			proj._vec.x = Math.randomInt(2) == 1 ? 1 : -1;
			proj._projectileHue = 130;
			proj._vec.y = 0;
			proj._vec.setMagnitude(0.1);
			proj._vec.turn(Math.deg2Rad(Math.random() * 30 - 15));
			proj._damage *= 0.5;
			proj._origMovement = proj.updateMovement;
			proj._origPos = proj.position();
			proj._targetDistance = 2 + Math.random() * 2;
			proj._phase = 0;
			proj._totalAngleChange = 0;
			proj.updateMovement = function() {
				if (this._phase == 0) {
					if (Kien.Vector2D.getDisplacementVector(this._boundbox.cx, this._boundbox.cy, this._origPos.x, this._origPos.y).magnitude <= 0.01) {
						this._phase = 1;
					}
				} else if (this._phase == 1) {
					var vec = Kien.Vector2D.getDisplacementVector(this.x, this.y, BattleManager.player.x, BattleManager.player.y);
			        var ang = this._vec.angleBetween(vec);
			        if (Math.rad2Deg(ang) <= 2) {
			        	this._phase = 2;
			        	this._vec.setMagnitude(0.05);
			        } else {
				        var dif = Math.deg2Rad(2);
				        ang = ang.clamp(-dif, dif);
				        this._totalAngleChange += Math.abs(ang);
				        this._vec.turn(ang, this._vec.clockwise(vec));
				        if (this._totalAngleChange >= 2 * Math.PI) {
				        	this._phase = 2;
				        }
			        }
				}
				this._origMovement.call(this);
			}.bind(proj);
		}
		this.addProjectile("Game_ShootingProjectileStraight", initFunc);
		this._waitCount = 1;
		this._shotCount++;
		if (this._shotCount > Math.round(15+15*this._enemy.hpRate())) {
			this._waitCount = 30 + Math.round(30 * this._enemy.hpRate());
			this._shotCount = 0;
		}
    } else {
    	this._waitCount--;
    }
}

Game_Interpreter.prototype.commonstage8movement = function() {
	switch(this.event()._skillPhase) {
		case 0:
			this.event()._x = $gamePlayer._x + this.event()._skillMoveShift;
			this.event()._y = $gamePlayer._y - 3;
			break;
		case 1:
			this.event()._x = $gamePlayer._x + this.event()._skillMoveShift;
			this.event()._y = $gamePlayer._y - 4;
			break;
		case 2:
			this.event()._x = $gamePlayer._x + this.event()._skillMoveShift;
			this.event()._y = $gamePlayer._y - 5;
			break;
	}
	if (this.event()._skillMoveWait == 0) {
		this.event()._skillMoveShift = Math.random() - 0.5;
		this.event()._skillMoveWait = 30 + Math.randomInt(60);
	} else {
		this.event()._skillMoveWait--;
	}
}

Game_Interpreter.prototype.commonstage8attack = function() {
	if (this.event()._skillWaitCount > 0) {
		this.event()._skillWaitCount--;
		return;
	}
	var bat = BattleManager.getBattlerFromEvent(this.event());
	switch(this.event()._skillPhase) {
		case 0:
		    var initFunc = function(proj) {
		        this.setProjectileProperty(proj);
		        var scatter = Math.PI/18 + this._enemy.hpRate() * Math.PI/18;
		        proj._vec._x = 0;
		        proj._vec._y = 1;
		        proj._vec.turn(Math.random()*scatter - scatter/2);
		        proj._vec.setMagnitude(0.075);
		    }.bind(bat);
		    bat.addProjectile("Game_ShootingProjectileStraight", initFunc);
		    if (BattleManager.player._equiping != 0) {
				AudioManager.playSe(patchforthisgame.machinegun);
		    }
		    this.event()._skillWaitCount = 2 + Math.round(bat._enemy.hpRate()*2);
		    this.event()._skillShotCount++;
		    var max = (90 + Math.randomInt(90));
		    if (this.event()._skillShotCount > max) {
		    	this.event()._skillShotCount = 0;
		    	this.event()._skillWaitCount = 10;
		    	while (this.event()._skillPhase == 0) {
		    		this.event()._skillPhase = Math.randomInt(3);
		    	}
		    }
			break;
		case 1:
			var initFunc = function(proj) {
				this.setProjectileProperty(proj);
		        proj._vec._x = 0;
		        proj._vec._y = 1;
				proj._vec.setMagnitude(Math.random() * 0.1 + 0.04);
				var scatter = Math.PI/12 + this._enemy.hpRate() * Math.PI / 12;
				proj._vec.turn(Math.random()*scatter - scatter/2);
				proj._damage *= 0.85;
			}.bind(bat);
			var max = 15;
			for (var n = 0; n < max; n++) {
				bat.addProjectile("Game_ShootingProjectileStraight", initFunc);
			}
			AudioManager.playSe(patchforthisgame.shotgun);
			this.event()._skillWaitCount = 30 + Math.round(bat._enemy.hpRate()*15);
			this.event()._skillShotCount++;
			var max = (20 + Math.randomInt(20));
			if (this.event()._skillShotCount > max) {
				this.event()._skillShotCount = 0;
				this.event()._skillWaitCount = 10;
				while (this.event()._skillPhase == 1) {
					this.event()._skillPhase = Math.randomInt(3);
				}
			}
			break;
		case 2:
			var initFunc = function(proj) {
				proj.childFunc = function(proj2, args) {
					this.setProjectileProperty(proj2);
					proj2.setAngle(args[0], args[1]);
					proj2.isValid = function() {
						return Math.sqrt((Math.pow(this.realX(), 2) + Math.pow(this.realY(), 2))) < 100;
					}.bind(proj2);
				};
				this.setProjectileProperty(proj);
				proj._projectileName = "Shot3";
				proj._pojectileHue = 180;
		        proj._vec._x = 0;
		        proj._vec._y = 1;
				proj._damage *= 0.4;
				proj._vec.setMagnitude(0.075);
				proj._acc = proj._vec.clone().applyMagnitude(-0.01);
				proj.isValid = function() {
					return Math.sqrt((Math.pow(this.realX(), 2) + Math.pow(this.realY(), 2))) < 100;
				}.bind(proj);
				proj.oldUpdateMovement = proj.updateMovement;
				proj.updateMovement = function() {
					proj.oldUpdateMovement();
					if (this._vec.magnitude <= 0.001) {
						this._vec.setMagnitude(0);
					}
				}
				var bat = this;
				proj.onFinish = function() {
					if (this._pierce == 0) {
						return;
					}
					var dif = 10 + Math.round(bat._enemy.hpRate() * 10);
					for (var n = 0; n <= 360; n += dif) {
						this.addProjectile("Game_ShootingProjectileStraight", this.childFunc.bind(this), Math.deg2Rad(n), 0.06);
					}
					AudioManager.playSe(patchforthisgame.splitgunsplit);
				}.bind(proj);
				proj._pierce = 2;
			}.bind(bat);
			bat.addProjectile("Game_ShootingProjectileStraight", initFunc);
			AudioManager.playSe(patchforthisgame.splitgunfire);
			this.event()._skillWaitCount = 20 + Math.round(bat._enemy.hpRate()*20);
			this.event()._skillShotCount++;
			var max = (20 + Math.randomInt(20));
			if (this.event()._skillShotCount > max) {
				this.event()._skillShotCount = 0;
				this.event()._skillWaitCount = 10;
				while (this.event()._skillPhase == 2) {
					this.event()._skillPhase = Math.randomInt(2);
				}
			}
			break;
	}
}

Game_Interpreter.prototype.commonstage5crystalmovement = function() {
	if (!this.event().isMoving()) {
		switch(this.event()._bdirection) {
			case 2:
				this.event()._x = this.event().xCoordToPosition(16);
				this.event()._bdirection = 6;
				break;
			case 4:
				this.event()._y = this.event().yCoordToPosition(12);
				this.event()._bdirection = 2;
				break;
			case 6:
				this.event()._y = this.event().yCoordToPosition(0);
				this.event()._bdirection = 8;
				break;
			case 8:
				this.event()._x = this.event().xCoordToPosition(0);
				this.event()._bdirection = 4;
				break;
		}
	}
}

Game_Interpreter.prototype.commonstage5crystalattack1 = function() {
	if (this.event()._skillWaitCount === undefined) {
		this.event()._skillWaitCount = 0;
	}
	if (this.event()._skillWaitCount == 0) {
		var e = this.event();
		var eb = $gameTroop.aliveMembers()[0];
		if (!!eb) {
			var initfunc = function(proj, args) {
				proj._damage = eb.atk;
				proj._opposite = BattleManager.playerMember.bind(BattleManager);
				proj._projectileName = eb.enemy().meta["ShootingProjectileImage"] || proj._projectileName;
				proj.setPosition(e._realX-0.5, e._realY-0.5);
				proj.setTarget({x: 8.5, y: 6.5}, 0.05);
				if (!!args[0]) {
					proj._vec.turn(args[0]);
				}
				proj._damage *= 0.5;
				proj._checkNearmiss = true;

			}
			BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc);
			if ($gameTroop.members()[0].hp <= 1000) {
				BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, Math.deg2Rad(20));
				BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, Math.deg2Rad(-20));
			} 
			if ($gameTroop.members()[0].hp <= 500) {
				BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, Math.deg2Rad(40));
				BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, Math.deg2Rad(-40));
			}
			e._skillWaitCount = 30;
		}
	} else {
		this.event()._skillWaitCount--;
	}
}

Game_Interpreter.prototype.commonstage5crystalattack2 = function() {
	if (this.event()._skillWaitCount === undefined) {
		this.event()._skillWaitCount = 0;
	}
	if (this.event()._skillWaitCount == 0) {
		var e = this.event();
		var eb = $gameTroop.aliveMembers()[0];
		if (!!eb) {
			var initfunc = function(proj, args) {
				proj._damage = eb.atk;
				proj._opposite = BattleManager.playerMember.bind(BattleManager);
				proj._projectileName = eb.enemy().meta["ShootingProjectileImage"] || proj._projectileName;
				proj.setPosition(e._realX-0.5, e._realY-0.5);
				switch (e._bdirection) {
					case 2:
					proj._vec = new Kien.Vector2D(0.05,0);
					break;
					case 4:
					proj._vec = new Kien.Vector2D(0,0.05);
					break;
					case 6:
					proj._vec = new Kien.Vector2D(0,-0.05);
					break;
					case 8:
					proj._vec = new Kien.Vector2D(-0.05,0);
				}
				if (!!args[0]) {
					proj._vec.turn(args[0]);
				}
				proj._damage *= 0.5;
				proj._checkNearmiss = true;

			}
			BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc);
			if ($gameTroop.members()[1].hp <= 1000) {
				BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, Math.deg2Rad(20));
				BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, Math.deg2Rad(-20));
			} 
			if ($gameTroop.members()[1].hp <= 500) {
				BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, Math.deg2Rad(40));
				BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, Math.deg2Rad(-40));
			}
			e._skillWaitCount = 20;
		}
	} else {
		this.event()._skillWaitCount--;
	}
}

Game_Interpreter.prototype.commonstage5crystalattack3 = function() {
	if (this.event()._skillWaitCount === undefined) {
		this.event()._skillWaitCount = 0;
	}
	if (this.event()._skillWaitCount == 0) {
		var e = this.event();
		var eb = $gameTroop.aliveMembers()[0];
		if (!!eb) {
			var initfunc = function(proj, args) {
				proj._damage = eb.atk;
				proj._opposite = BattleManager.playerMember.bind(BattleManager);
				proj._projectileName = eb.enemy().meta["ShootingProjectileImage"] || proj._projectileName;
				proj.setPosition(e._realX-0.5, e._realY-0.5);
				var spd = 0.4
				if ($gameTroop.members()[2].hp <= 1000) {
					spd = 0.45;
				}
				if ($gameTroop.members()[2].hp <= 500) {
					spd = 0.5;
				}
				proj.setAngle(args[0], 0.04);
				proj._damage *= 0.5;
				proj._checkNearmiss = true;

			}
			var dif = 60;
			if ($gameTroop.members()[2].hp <= 1000) {
				dif = 30;
			}
			if ($gameTroop.members()[2].hp <= 500) {
				dif = 10;
			}
			for (var ang = 0; ang <= 360; ang += dif) {
				BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, Math.deg2Rad(ang));
			}
			e._skillWaitCount = 40;
			if ($gameTroop.members()[2].hp <= 1000) {
				e._skillWaitCount = 20;
			}
			if ($gameTroop.members()[2].hp <= 500) {
				e._skillWaitCount = 10;
			}
		}
	} else {
		this.event()._skillWaitCount--;
	}
}

Game_Interpreter.prototype.commonstage5crystalattack4 = function() {
	if (this.event()._skillWaitCount === undefined) {
		this.event()._skillWaitCount = 0;
	}
	if (this.event()._skillAngle === undefined) {
		this.event()._skillAngle = 0;
	}
	if (this.event()._skillWaitCount == 0) {
		var e = this.event();
		var eb = $gameTroop.aliveMembers()[0];
		if (!!eb) {
			var initfunc = function(proj, args) {
				proj.childFunc = function(proj, argss) {
					proj._damage = this._damage * 0.5;
					proj.setPosition(this.x, this.y);
					proj._checkNearmiss = true;
					proj.setAngle(argss[0], 0.05);
					proj._projectileName = this._projectileName;
					proj._opposite = this._opposite;
				}.bind(proj);
				proj._childAngle = args[0];
				proj._damage = eb.atk;
				proj._opposite = BattleManager.playerMember.bind(BattleManager);
				proj._projectileName = eb.enemy().meta["ShootingProjectileImage"] || proj._projectileName;
				proj.setPosition(e._realX-0.5, e._realY-0.5);
				proj.setTarget({x: 8.5, y: 6.5}, 0.1);
				proj._damage *= 0.5;
				proj._checkNearmiss = true;
				proj._owner = BattleManager.extra;
       			proj.oldUpdateMovement = proj.updateMovement;
        		proj.updateMovement = function() {
		        	proj.oldUpdateMovement();
		        	if (Kien.Vector2D.getDisplacementVector(this.x, this.y, 8.5, 6.5).magnitude <= 0.15) {
		        		this._vec.setMagnitude(0);
		        	}
		        }.bind(proj);
		        proj.onFinish = function() {
		        	if (this._pierce == 0) {
		        		return;
		        	}
		        	var dif = 30;
					if ($gameTroop.members()[3].hp <= 1000) {
						dif = 25;
					}
					if ($gameTroop.members()[3].hp <= 1000) {
						dif = 20;
					}
		            for (var n = this._childAngle; n <= 360 + this._childAngle; n += dif) {
		                this.addProjectile("Game_ShootingProjectileStraight", this.childFunc.bind(this), Math.deg2Rad(n), 0.1);
		            }
		        }.bind(proj);
		        proj._pierce = 1;
			}
			BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initfunc, this.event()._skillAngle);
			e._skillAngle = (e._skillAngle + 10) % 360;
			e._skillWaitCount = 120;
			if ($gameTroop.members()[3].hp <= 1000) {
				e._skillWaitCount = 60;
			}
			if ($gameTroop.members()[3].hp <= 500) {
				e._skillWaitCount = 30;
			}
		}
	} else {
		this.event()._skillWaitCount--;
	}
}
Game_Interpreter.prototype.commonstage4attack = function() {
	var e = this.event();
	var list = BattleManager.playerMember().concat(BattleManager.enemyMember());
	var listFunc = function() {return this}.bind(list);
	if (!!e) {
		var initFunc = function(proj, args) {
			proj.setPosition(e.x-0.5, e.y-0.5);
			proj.setAngle(args[0], 0.05);
			proj._damage = 80;
			proj._opposite = listFunc;
			proj._projectileName = "Shot2";
			proj.modifyDamage = function(target) {return !!target.battler && target.battler().isActor() ?  this._damage : this._damage*0.2;}.bind(proj);
		}
		for (var ang = 0; ang < 360; ang += 20) {
			BattleManager.extra.addProjectile("Game_ShootingProjectileStraight", initFunc, Math.deg2Rad(ang));
		}
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
				if ($gameParty.hasItem($dataItems[patchforthisgame.movespeed[1]])){
					d *= 1.1;
				}
				if ($gameParty.hasItem($dataItems[patchforthisgame.movespeed[2]])){
					d *= 1.15;
				}
				return d;
			};
        }
        if (!this._shootingMap) {
            this._shootingMap = new Game_Map();
        }
        this._shootingPlayer.refresh();
        this._lastPixelMoveEnable = $gameSystem._pixelMoveEnabled;
        $gameSystem._pixelMoveEnabled = true;
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
	this._weaponNameSprite.y = Graphics._height - this._weaponNameSprite.height - 48;
	this._weaponNameSprite.x = 48;
	this.addChild(this._weaponNameSprite);
}

Sprite_ShootingHpGauge.prototype.updateGaugeContent = function() {
    if (this._lastValue != this._gaugeFunc()) {
        this._lastValue = this._gaugeFunc();
        this._gaugeSprite.bitmap.clear();
        var index = -1;
        if (this._type) {
            index = Math.floor(this._lastValue / 1000);
        } else {
        	if ($gameVariables.value(5) == 7) {
            	index = Math.floor(this._lastValue / 4000);
        	} else {
            	index = Math.floor(this._lastValue / 2000);
        	}
        }
        var fore = this.getColor(index);
        var back = this.getColor(index-1);
        var rate = 1;
        if (this._type) {
            rate = ((this._lastValue) % 1000) / 1000;
        } else {
        	if ($gameVariables.value(5) == 7) {
            	rate = ((this._lastValue) % 4000) / 4000;
        	} else {
            	rate = ((this._lastValue) % 2000) / 2000;
        	}
        }
        this._gaugeSprite.bitmap.fillRect(0,0,this._gaugeSprite.width, this._gaugeSprite.height, fore);
        if (back) {
            this._gaugeSprite.bitmap.fillRect(0,0,this._gaugeSprite.width, this._gaugeSprite.height * (1-rate), back);
        } else {
            this._gaugeSprite.bitmap.clearRect(0,0, this._gaugeSprite.width, this._gaugeSprite.height * (1-rate));
        }
    }
}


Scene_Title.prototype.update = function() {
	if (!this.isBusy() && (Input.isTriggered('ok') || TouchInput.isTriggered())) {
		SoundManager.playOk();
		this.commandNewGame();
	}
    Scene_Base.prototype.update.call(this);
    if (this._pressOpacityWait > 0) {
    	this._pressOpacityWait--;
    	return;
    }
    if (this._pressOpacityDir) {
    	this._pressAnyKeySprite.opacity -= 16;
    	if (this._pressAnyKeySprite.opacity <= 0) {
    		this._pressOpacityDir = false;
    	}
    } else {
    	this._pressAnyKeySprite.opacity += 16;
    	if (this._pressAnyKeySprite.opacity >= 255) {
    		this._pressOpacityDir = true;
    		this._pressOpacityWait = 30;
    	}
    }
};


Scene_Title.prototype.createCommandWindow = function() {
    this._pressOpacityWait = 0;
	this._pressOpacityDir = true;
	this._pressAnyKeySprite = new Sprite_Base();
	this._pressAnyKeySprite.bitmap = new Bitmap(Graphics.width, 40);
	this._pressAnyKeySprite.bitmap.fillRect(0,0,Graphics.width,40,"rgba(0,0,0,0.5)");
	this._pressAnyKeySprite.bitmap.drawText("PRESS ENTER KEY",0,0,Graphics.width,40,'center');
	this._pressAnyKeySprite.y = Graphics.height - 180;
	this.addChild(this._pressAnyKeySprite);
};

Scene_Title.prototype.commandNewGame = function() {
    DataManager.setupNewGame();
    //this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};

Scene_Title.prototype.isBusy = function() {
    return Scene_Base.prototype.isBusy.call(this);
};
