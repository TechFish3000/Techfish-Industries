//this is NOT the complete definition for this block! see content/blocks/scatter-silo.hjson for the stats and other properties.

//const { Font } = require("p5");
const depth = 9;
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
	}
});

plastDrill.buildType = () => extend(GenericCrafter.GenericCrafterBuild, plastDrill, {
	draw() {
		Draw.rect(plastDrill.regions[0], this.x, this.y);
		//var liquid = combustionComp.consumes.get(ConsumeType.liquid).liquid;
		Draw.rect(plastDrill.regions[3],this.x, this.y, this.totalProgress * 2)
        font.draw(String(depth), this.x + 50, this.y - 50, Color.valueOf("FF00FF"), 0.8, true, 0)
		
		//Draw.rect(combustionComp.regions[4], this.x, this.y);
	}
});