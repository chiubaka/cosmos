// crafting/tooltip.dust
(function(){dust.register("crafting/tooltip",body_0);function body_0(chk,ctx){return chk.write("<h3 class='name'>").reference(ctx._get(false, ["name"]),ctx,"h").write("</h3>").exists(ctx._get(false, ["description"]),ctx,{"block":body_1},null).write("<h4 class='reactants'>Reactants</h4><ul class='reactants'>").section(ctx._get(false, ["reactants"]),ctx,{"block":body_2},null).write("</ul>");}function body_1(chk,ctx){return chk.write("<p class='description'>").reference(ctx._get(false, ["description"]),ctx,"h").write("</p>");}function body_2(chk,ctx){return chk.write("<li class='reactant'><div class='block-canvas-container'><canvas class='reactant' width='26' height='26'/><span class='quantity'>").reference(ctx._get(false, ["quantity"]),ctx,"h").write("</span></div><span class='block-type'>").reference(ctx._get(false, ["blockType"]),ctx,"h").write("</span></li>");}return body_0;})();
