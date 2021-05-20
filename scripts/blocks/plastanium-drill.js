//this is NOT the complete definition for this block! see content/blocks/scatter-silo.hjson for the stats and other properties.


//const { Font } = require("p5");
//let depth = 99;
//create a simple shockwave effect
// const siloLaunchEffect = newEffect(20, e => {
//     Draw.color(Color.white, Color.lightGray, e.fin()); //color goes from white to light gray
//     Font.draw("yeet", e.x, e.y); //line thickness goes from 3 to 0
//     Lines.circle(e.x, e.y, e.fin() * 100); //draw a circle whose radius goes from 0 to 100
// });

// //create the block type
// const silo = extendContent(Block, "plastanium-drill", {
//     //override the method to build configuration
//     buildConfiguration(tile, table) {
//         table.addButton("yes" , Styles.clearTransi, run(() => {
//             //configure the tile to signal that it has been pressed (this sync on client to server)
//             tile.configure(0)
//         }))
//     },

//     //override configure event
//     configured(tile, value) {
//         //make sure this silo has the items it needs to fire
//         Effects.effect(siloLaunchEffect, tile)
//         //make this effect occur at the tile location


//         //create 10 bullets at this tile's location with random rotation and velocity/lifetime

//     }
// })

const lootTable = [[], ["sand"], ["sand", "copper", "coal"], ["copper", "coal", "lead"], ["copper", "coal", "lead"], ["coal", "lead"], ["coal", "lead", "titanium"], ["lead", "titanium"], ["titanium", "thorium"], ["thorium"], ["surge-alloy"]]
const allPossible = ["sand", "copper", "coal", "lead", "titanium", "thorium", "surge-alloy"]
const surgeTimeMult = 4

const depthcolors = ["646464", "f5e187", "c2915d", "c97f34", "c97f34", "634370", "522c94", "8243f0", "b14aff", "d91cff", "ee00ff"]
const modeNames = ["Adjusting", "Mining"]
const modeColours = ["FF0000", "00FF00"]

const hardened_titanium = Vars.content.getByName(ContentType.item, "techfish-industries-hardened-titanium")


print("lod")
let font = Fonts.outline;
const plastDrill = extend(GenericCrafter, "plastanium-drill", {
	load() {
		this.super$load();
		this.regions = [];
		this.regions[0] = Core.atlas.find(this.name);
		print("loaded lmao")
		this.regions[3] = Core.atlas.find(this.name + "-rotator");

		//this.regions[4] = Core.atlas.find(this.name + "-top");
	},

	// buildConfiguration(table) {


	// 	table.Button(Icon.upOpen, Styles.clearTransi, run(() => {
	// 		//configure the tile to signal that it has been pressed (this sync on client to server)
	// 		configure(-1)
	// 	}))
	// 	table.Button(Icon.download, Styles.clearTransi, run(() => {
	// 		//configure the tile to signal that it has been pressed (this sync on client to server)
	// 		configure(1)
	// 	}))

	// },




	// updateTile(){
	// 	if(tile.cons.valid()){

	// 		progress += getProgressIncrease(craftTime);
	// 		totalProgress += delta();
	// 		warmup = Mathf.lerpDelta(warmup, 1, 0.02);

	// 		if(Mathf.chanceDelta(updateEffectChance)){
	// 			updateEffect.at(getX() + Mathf.range(size * 4f), getY() + Mathf.range(size * 4));
	// 		}
	// 	}else{
	// 		warmup = Mathf.lerp(warmup, 0f, 0.02f);
	// 	}

	// 	if(progress >= 1){
	// 		consume();

	// 		if(outputItem != null){
	// 			for(int i = 0; i < outputItem.amount; i++){
	// 				offload(outputItem.item);
	// 			}
	// 		}

	// 		if(outputLiquid != null){
	// 			handleLiquid(this, outputLiquid.liquid, outputLiquid.amount);
	// 		}

	// 		craftEffect.at(x, y);
	// 		progress %= 1f;
	// 	}

	// 	if(outputItem != null && timer(timerDump, dumpTime)){
	// 		dump(outputItem.item);
	// 	}

	// 	if(outputLiquid != null){
	// 		dumpLiquid(outputLiquid.liquid);
	// 	}
	// }







});
let count = 40
let mode = 0

plastDrill.buildType = () => extend(GenericCrafter.GenericCrafterBuild, plastDrill, {
	created() {
		this.super$created()
		print("loaded")
		this.TFIdepth = 0
		this.targetDepth = 0
		this.miningTarget = 0
		this.surgeCounter = 0
		mode = 0 // 0= adj, 1=mining
		if (this.block.consumes.all()[0].type() == ConsumeType.power) {
			this.block.consumes.remove(this.block.consumes.getPower().type())
			print(this.block.consumes.item(Vars.content.getByName(ContentType.item, "techfish-industries-hardened-titanium"), 250))
			this.block.consumes.init()
		}
	},
	// load(){
	//     this.super$load()
	//     dict = {}
	// },

	draw() {
		//if (this.count == 0) {
		//	this.depth = this.TFIdepth + 1
		//	this.count = 40
		//}
		//else {
		//	this.count -= 1
		//}

		//this.TFIdepth %= 11
		Draw.rect(plastDrill.regions[0], this.x, this.y);
		//var liquid = combustionComp.consumes.get(ConsumeType.liquid).liquid;
		Draw.rect(plastDrill.regions[3], this.x, this.y, this.totalProgress * 2)
		font.draw(String(this.TFIdepth), this.x, this.y + 2, Color.valueOf(depthcolors[this.TFIdepth]), 0.4, true, 1)

		font.draw(String(modeNames[mode]), this.x, this.y - 6, Color.valueOf(modeColours[mode]), 0.2, false, 1)
		if (this.TFIdepth != this.targetDepth) {
			font.draw("(" + String(this.targetDepth) + ")", this.x, this.y + 8, Color.valueOf(depthcolors[this.targetDepth]), 0.2, false, 1)
		}
		//Draw.rect(combustionComp.regions[4], this.x, this.y);


		// -10, -10 is down-left
		// +10, +10 is just too far up right
		// +7, +7 is too far left by a little, too high up
		//changing h to 1
	},
	buildConfiguration(parent) {
		const table = parent.fill();


		const adjust = table.button(Icon.pause,
			Styles.clearTransi, () => {
				// Cycle through modes
				this.configure(1)
				//print(this.cons.valid())
			}).size(40).disabled(boolf(b => mode == 0)).get();

		const mine = table.button(Icon.play,
			Styles.clearTransi, () => {
				// Cycle through modes
				this.configure(2)
				//print(this.cons.valid())
			}).size(40).disabled(boolf(b => mode == 1)).get();

		const descend = table.button(Icon.download,
			Styles.clearTransi, () => {
				// Cycle through modes
				this.configure(3)
				//print(this.cons.valid())
			}).size(40).disabled(boolf(b => (this.tile.entity != null && !this.cons.valid()) || mode == 1)).get();

		const reset = table.button(Icon.upOpen,
			Styles.clearTransi, () => {
				// Cycle through modes
				this.configure(4)
				//print(this.cons.valid())
			}).size(40).disabled(boolf(b => (this.tile.entity != null && !this.cons.valid()) || mode == 1)).get();

		// const debug = table.button(Icon.upOpen,
		// 	Styles.clearTransi, () => {
		// 		// Cycle through modes
		// 		print("-=-=-=-")
		// 		for (let i = 0; i < this.block.consumes.all().length; i++) {
		// 			print(this.block.consumes.all()[i].type())
		// 		}
		// 		print(this.block.consumes.all())
		// 		print("Cons Valid: " + String(this.cons.valid()))
		// 		print("-=-=-=-")
		// 		//print(this.cons.valid())
		// 	}).size(40).get();

	},
	//override configure event
	configured(tile, value) {
		//make sure this silo has the items it needs to fire
		if (value == 1) {
			mode = 0
			this.block.consumes.remove(this.block.consumes.getPower().type())
			print(this.block.consumes.item(Vars.content.getByName(ContentType.item, "techfish-industries-hardened-titanium"), 250))
			this.block.consumes.init()
			//this.cons.update()
		}
		if (value == 2) {
			mode = 1
			this.block.consumes.remove(this.block.consumes.getItem().type())
			print(this.block.consumes.power(6))
			this.block.consumes.init()
			//this.cons.update()
		}
		if (value == 3) {
			this.targetDepth = this.targetDepth + 1

		}
		if (value == 4) {
			this.targetDepth = 0
		}
	},
	updateTile() {
		if (this.cons.valid() && mode == 0 && this.TFIdepth != this.targetDepth) {

			this.progress += this.getProgressIncrease(this.block.craftTime);
			this.totalProgress += this.delta();
			this.warmup = Mathf.lerpDelta(this.warmup, 1, 0.02);

			if (Mathf.chanceDelta(this.block.updateEffectChance)) {
				this.block.updateEffect.at(this.x + Mathf.range(this.block.size * 4), this.y + Mathf.range(this.block.size * 4));
			}
		}
		else if (this.cons.valid() && mode == 1) {
			this.progress += this.getProgressIncrease(this.block.craftTime);
			this.totalProgress += this.delta();
			this.warmup = Mathf.lerpDelta(this.warmup, 1, 0.02);

			if (Mathf.chanceDelta(this.block.updateEffectChance)) {
				this.block.updateEffect.at(this.x + Mathf.range(this.block.size * 4), this.y + Mathf.range(this.block.size * 4));
			}
		}
		else {
			this.warmup = Mathf.lerp(this.warmup, 0, 0.02);
		}

		if (this.progress >= 1) {
			if (mode == 0) {

				this.consume();

				if (this.TFIdepth < this.targetDepth) {
					this.TFIdepth += 1
				}
				if (this.TFIdepth > this.targetDepth) {
					this.TFIdepth -= 1
				}


				this.block.craftEffect.at(this.x, this.y);
				this.progress %= 1;
			}
			let outsum = 0

			for (let k = 0; k < allPossible.length; k++) {
				outsum += this.items.get(Vars.content.getByName(ContentType.item, allPossible[k]))
			}




			if (mode == 1 && outsum < this.block.itemCapacity) {
				this.consume();

				if (this.TFIdepth == 10) {
					if (this.surgeCounter == 0) {
						this.offload(Vars.content.getByName(ContentType.item, lootTable[this.TFIdepth][0]));
						this.surgeCounter++
					}
					else {
						this.surgeCounter++
						this.surgeCounter %= surgeTimeMult
					}
				}

				else if (lootTable[this.TFIdepth].length > 1) {
					this.miningTarget++
					this.miningTarget %= lootTable[this.TFIdepth].length
					this.offload(Vars.content.getByName(ContentType.item, lootTable[this.TFIdepth][this.miningTarget]));
				}
				else if (this.TFIdepth == 0) {
					// nothing lol
				}
				else if (lootTable[this.TFIdepth].length == 1) {
					this.offload(Vars.content.getByName(ContentType.item, lootTable[this.TFIdepth][0]))
				};
				this.block.craftEffect.at(this.x, this.y);
				this.progress %= 1;

			}



		}
		if (this.outputItem != null && this.timer(timerDump, dumpTime)) {
			this.dump(this.outputItem.item);
		}



	}, 
	read(a, b){
		this.super$read(a, b)
		mode = a.i()
		if (mode == 1){
			this.block.consumes.remove(this.block.consumes.getItem().type())
			print(this.block.consumes.power(6))
			this.block.consumes.init()
		}
		this.TFIdepth = a.i();
        this.targetDepth = a.i();
		this.miningTarget = a.i();
		this.surgeCounter = a.i();
		
	},
	write(a){
		this.super$write(a)
		a.i(mode)
		a.i(this.TFIdepth)
		a.i(this.targetDepth)
		a.i(this.miningTarget)
		a.i(this.surgeCounter)
	}

});