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

const depthcolors = ["646464", "f5e187", "c2915d", "c97f34", "c97f34", "634370", "522c94", "8243f0", "b14aff", "d91cff", "ee00ff"]
const modeNames = ["Adjusting", "Mining"]
const modeColours = ["FF0000", "00FF00"]

let tit = Vars.content.getByName(ContentType.item, "titanium")


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
plastDrill.buildType = () => extend(GenericCrafter.GenericCrafterBuild, plastDrill, {
	created() {
		this.super$created()
		print("loaded")
		this.TFIdepth = 0
		this.targetDepth = 0
		this.mode = 0 // 0= adj, 1=mining
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

		font.draw(String(modeNames[this.mode]), this.x, this.y - 1, Color.valueOf(modeColours[this.mode]), 0.2, false, 1)
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
			}).size(40).disabled(boolf(b => this.mode == 0)).get();

		const mine = table.button(Icon.play,
			Styles.clearTransi, () => {
				// Cycle through modes
				this.configure(2)
				//print(this.cons.valid())
			}).size(40).disabled(boolf(b => this.mode == 1)).get();

		const descend = table.button(Icon.download,
			Styles.clearTransi, () => {
				// Cycle through modes
				this.configure(3)
				//print(this.cons.valid())
			}).size(40).disabled(boolf(b => (this.tile.entity != null && !this.cons.valid()) || this.mode == 1)).get();

		const reset = table.button(Icon.upOpen,
			Styles.clearTransi, () => {
				// Cycle through modes
				this.configure(4)
				//print(this.cons.valid())
			}).size(40).disabled(boolf(b => (this.tile.entity != null && !this.cons.valid()) || this.mode == 1)).get();

		const resett = table.button(Icon.upOpen,
			Styles.clearTransi, () => {
				// Cycle through modes

				print(this.block.consumes.all().length)
				print(this.block.consumes.all()[this.block.consumes.all().length - 1].type())

				//print(this.cons.valid())
			}).size(40).get();

	},
	//override configure event
	configured(tile, value) {
		//make sure this silo has the items it needs to fire
		if (value == 1) {
			this.mode = 0
			this.block.consumes.remove(this.block.consumes.getPower().type())
			print(this.block.consumes.item(tit, 50))
			this.block.consumes.init()
			//this.cons.update()
		}
		if (value == 2) {
			this.mode = 1
			this.block.consumes.remove(this.block.consumes.getItem().type())
			print(this.block.consumes.power(6))
			this.block.consumes.init()
			//this.cons.update()
		}
		if (value == 3) {
			this.TFIdepth = this.TFIdepth + 1

		}
		if (value == 4) {
			this.TFIdepth = 0
		}
	},
	updateTile() {
		if (this.consValid() && this.mode == 0 && this.TFIdepth != this.targetDepth) {

			progress += getProgressIncrease(craftTime);
			totalProgress += delta();
			warmup = Mathf.lerpDelta(warmup, 1, 0.02);

			if (Mathf.chanceDelta(updateEffectChance)) {
				updateEffect.at(getX() + Mathf.range(size * 4), getY() + Mathf.range(size * 4));
			}
		} else {
			warmup = Mathf.lerp(warmup, 0, 0.02);
		}

		if (progress >= 1) {
			this.consume();

			if (this.TFIdepth < this.targetDepth){
				this.TFIdepth += 1
			}
			if (this.TFIdepth > this.targetDepth){
				this.TFIdepth -= 1
			}
			

			craftEffect.at(x, y);
			progress %= 1;
		}

		if (outputItem != null && timer(timerDump, dumpTime)) {
			dump(outputItem.item);
		}

	
	}

});