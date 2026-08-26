window.FORNO_MENU = Object.freeze([
  {id:"margherita",name:"Margherita Clássica",category:"tradicionais",categoryLabel:"Tradicional",badge:"Mais pedida",description:"Molho San Marzano, muçarela de búfala, manjericão fresco e azeite extra virgem. Leve, aromática e sempre irresistível.",image:"assets/images/hero-dona-rosa.jpg",traits:["classica","suave","queijo","vegetariana"]},
  {id:"calabresa",name:"Calabresa Artesanal",category:"tradicionais",categoryLabel:"Tradicional",badge:"Clássico da casa",description:"Calabresa artesanal, cebola roxa, muçarela e orégano fresco em uma pizza intensa, reconfortante e cheia de personalidade.",image:"assets/images/gallery-oven-scene.jpg",traits:["classica","intensa","carne"]},
  {id:"dona-rosa",name:"Dona Rosa",category:"especiais",categoryLabel:"Assinatura da casa",badge:"Pizza assinatura",description:"Presunto cru, muçarela de búfala, tomate confit, rúcula e parmesão. A combinação que traduz o espírito da casa em cada fatia.",image:"assets/images/hero-dona-rosa.jpg",traits:["autoral","intensa","carne","aventura"]},
  {id:"quatro-formaggi",name:"Quatro Formaggi",category:"especiais",categoryLabel:"Especial da Casa",badge:"Para amantes de queijo",description:"Muçarela, gorgonzola, parmesão, provolone e toque de mel. Cremosa, marcante e perfeita para quem quer uma experiência mais intensa.",image:"assets/images/gallery-cheese-pull.jpg",traits:["autoral","intensa","queijo"]},
  {id:"orto",name:"Orto no Fogo",category:"veganas",categoryLabel:"Vegetariana & Vegana",badge:"Frescor do forno",description:"Abobrinha, cogumelos, tomate confit, cebola roxa e pesto de manjericão. Fresca, aromática e equilibrada do começo ao fim.",image:"assets/images/gallery-oven-scene.jpg",traits:["autoral","suave","vegetais","vegetariana"]},
  {id:"nutella",name:"Nutella com Morango",category:"doces",categoryLabel:"Doce",badge:"Final irresistível",description:"Creme de avelã, morangos frescos e açúcar de confeiteiro sobre uma massa levemente tostada. A sobremesa que encerra a noite em alto nível.",image:"assets/images/gallery-nutella-morango.jpg",traits:["doce","aventura"]}
]);
window.FORNO_PRICING = Object.freeze({
  sizes:{media:{label:"Média",multiplier:1},grande:{label:"Grande",multiplier:1.18},familia:{label:"Família",multiplier:1.42}},
  crusts:{tradicional:{label:"Tradicional",add:0},catupiry:{label:"Catupiry",add:8},cheddar:{label:"Cheddar",add:7}},
  halfHalfRule:"maior_preco"
});
