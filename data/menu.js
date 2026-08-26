window.FORNO_MENU = Object.freeze([
  {id:"margherita",name:"Margherita Clássica",category:"tradicionais",categoryLabel:"Tradicional",description:"Molho San Marzano, muçarela de búfala, manjericão fresco e azeite extra virgem.",basePrice:54.90,traits:["classica","suave","queijo","vegetariana"]},
  {id:"calabresa",name:"Calabresa Artesanal",category:"tradicionais",categoryLabel:"Tradicional",description:"Calabresa artesanal, cebola roxa, muçarela e orégano fresco.",basePrice:52.90,traits:["classica","intensa","carne"]},
  {id:"dona-rosa",name:"Dona Rosa",category:"especiais",categoryLabel:"Assinatura da casa",description:"Presunto cru, muçarela de búfala, tomate confit, rúcula e parmesão.",basePrice:63.90,traits:["autoral","intensa","carne","aventura"]},
  {id:"quatro-formaggi",name:"Quatro Formaggi",category:"especiais",categoryLabel:"Especial da Casa",description:"Muçarela, gorgonzola, parmesão, provolone e toque de mel.",basePrice:61.90,traits:["autoral","intensa","queijo"]},
  {id:"orto",name:"Orto no Fogo",category:"veganas",categoryLabel:"Vegetariana",description:"Abobrinha, cogumelos, tomate confit, cebola roxa e pesto de manjericão.",basePrice:58.90,traits:["autoral","suave","vegetais","vegetariana"]},
  {id:"nutella",name:"Nutella com Morango",category:"doces",categoryLabel:"Doce",description:"Creme de avelã, morangos frescos e açúcar de confeiteiro.",basePrice:49.90,traits:["doce","aventura"]}
]);
window.FORNO_PRICING = Object.freeze({
  sizes:{media:{label:"Média",multiplier:1},grande:{label:"Grande",multiplier:1.18},familia:{label:"Família",multiplier:1.42}},
  crusts:{tradicional:{label:"Tradicional",add:0},catupiry:{label:"Catupiry",add:8},cheddar:{label:"Cheddar",add:7}},
  halfHalfRule:"maior_preco"
});