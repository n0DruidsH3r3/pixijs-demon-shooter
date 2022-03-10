function updateGUI() {
    document.getElementById("player-health").textContent = player.health + " / " + player.maxHealth;
    document.getElementById("weapon-bullets").textContent = bulletController.bulletType + " " + bulletController.weapons.get(bulletController.bulletType);

    document.getElementById("tank-demons-span").textContent   = demonController.demonsKilled.get(DemonTypeEnum.TANK);
    document.getElementById("caster-demons-span").textContent = demonController.demonsKilled.get(DemonTypeEnum.CASTER);
    document.getElementById("runner-demons-span").textContent = demonController.demonsKilled.get(DemonTypeEnum.RUNNER);

    document.getElementById("weapons-pickup-span").textContent = spawnableController.weaponsPicked;
    document.getElementById("health-potions-pickup-span").textContent = spawnableController.healthPotionsConsumed;

    document.getElementById("time-played-span").textContent = Math.ceil((new Date() - startTime) / 1000);
    document.getElementById("difficulty-level-span").textContent = gameController.difficulty;

    document.getElementById("bullets-fired-span").textContent = bulletController.bulletsFired;
    document.getElementById("flies-spawned-span").textContent = demonController.fliesSpawned;
    document.getElementById("demon-gates-spawned-span").textContent = spawnableController.demonGatesSpawned;
}

function restartGame() {
    gameController.resetGame();
    document.getElementById("game-over").style.overflow = "hidden";
}

const ticker = setInterval(updateGUI, 100);
const startTime = new Date();