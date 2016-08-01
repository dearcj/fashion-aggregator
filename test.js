/**
 * Created by KURWINDALLAS on 19.07.2016.
 */
'use strict';
var _ = require('underscore');
var dict = require('./Backend/BTreeDictionary/BTDictionary.js');
var FCategory = require('./Backend/Features/FCategory.js').FCategory;
var FPrice = require('./Backend/Features/FPrice.js').FPrice;

var AppClass = require('./Backend/App.js');
var gcapp = new AppClass.App();
var Classify = require('./Backend/Classify.js').Classify;
var d = new dict.BTDictionary();


function pgq (q, params, cb) {
  User.query({text: q, values: params}, function(err, results) {

    var rows = null;
    if (results) rows = results.rows;
    cb(err, rows);
  });
}


var brands = ["a p c","a. p. c.","abbie rose","acne studios","adidas by kolor","adidas by raf simons","adidas by rick owens","adidas originals","adidas x kanye west","adieu","aerobatix","agi sam","agnelle","alberto guardiani","alexander smith","alicemadethis","all blues","alpha industries","american vintage","ami","anchor crew","andersons","andrea zori","anthology paris","armani collezioni","armani jeans","armogan","armor lux","arthur","asics","atalaye","atelier prive","atelier scotch","atlantic stars","avoc","ayame","balmondain","barbati","barbour","basus","battling joe","be positive","bear uhrband","belstaff","ben sherman","benjamin jezequel","billtornade","billy belt","birkenstock","bleu de chauffe","boardies","bobbies","bois","bonastre","boregart","boris bidjan saberi","braceletsnato","braun","briston","brooks","brownie and blondie","bruce field","burberry","burlington","buttero","c p company","c.p. company","calvin klein","calvin klein underwear","camper","canada goose","carhartt wip","carven","casely hayford","casio","casio g shock","castelijn beerens","celio club","champion","chateau landon","christopher kane","christopher raeburn","churchs","clae","clarks","clarks originals","clomm","closed","cmmn swdn","colmar","coltesse","comme des garcons","commune de paris","converse","converse by jack purcell","cool garcon","cutler and gross","dagobear","damir doma silent","damir doma silent x oki ni","denim supply ralph lauren","denis music","department 5","diemme","diesel","dnm pieces le laboratoire","dockers","dolce gabbana","dondup","doucal s","dr jackson s","dr martens","dr summer","dries van noten","drkshdw by rick owens","dsquared2","dsquared2 underwear","duoo underwear","dutt","ea7 emporio armani","eastpak","edwin","electric","eleven paris","emporio armani","emporio armani underwear","ermenegildo zegna","escentric molecules","estime","etiquette clothiers","etudes studio","evisu","faguo","falke","filippa k","filling pieces","fit skin care","fjall raven","frame denim","fratelli rossetti","fred perry","french rdv","frenchtrotters","G-Star","galucebo","gant","gant rugger","george gina lucy","gilbert gilbert","gili s","giorgio armani","gloverall","golden goose","gosha rubchinskiy","goti","grenson","guess","gustave cie","hackett","harrington","harris wharf london","harris wilson","hartford","havaianas","hemen biarritz","herschel","heschung","hogan","homecore","hood by air","hoon","hudson","hugo hugo boss","ice b","Icon Brand","ikks","il bussetto","illesteva","incase","invicta","ipanema","italians gentlemen","Jack & Jones","jagvi","jaqk","jason markk","jil sander","jimmy choo","jonathan saunders","junkers","k swiss","K-Way","kartell fragrance","kenzo","kenzo time","knowledge cotton apparel","komono","ktz","kuboraum","l herbe rouge","la panoplie","lacoste","lacoste live","lacoste underwear","lanvin","lanvin jewellery","laurenceairline","le coq sportif","le feuillet","le tanneur","leather crown","les art ists","Levi's","levi s vintage clothing","lexon","lights of london","linda farrow","loake","lonesome detail","louis quatorze","luminara","ly adams","lyle and scott x jonathan saunders","m moustache","m studio","maison kitsune","maison labiche","maison margiela","maison voliaire","mamama","marc by marc jacobs","marcelo burlon","marion martigny","marlboro classic","marni","massimo vello","matthew miller","maxwell scott bags","mc alson","McQ by Alexander McQueen","melindagloss","menlook","menlook label","mes lacets","minimum","mipac","missoni","moncler","mr jones watches","mykita","mykita x maison martin margiela","nasir mazhar","national standard","native youth","nava design","new balance","new england","new era","new man","nike","nixon","nixon x star wars","Hot","nonnative","norse projects","novesta","nudie jeans","o fere design","oakley","oamc","obey","objest","odin","off white","officine generale","oliver spencer","olow","ontour","opening ceremony","orciani","orlebar brown","orner","our legacy","ozed","paolo pecora","parajumpers","patagonia","patrizia pepe","patrons","paul and joe","paul smith ps","penfield","pete sorensen","peter may walk","petrus","petrusse","peuterey","philippe model","pic de nore","piola","pochette square","pointer","polo ralph lauren","porter","project pieta","projects watches","puma","pyrenex","raf simons","rains","red wing","reebok","rich gone broke","rick owens","rigaud","rivieras","roberto collina","roots","roscoe","rose et marius","rosendahl","rough tumble","roundel","roundel london","s n s herning","saint sens","samsoe and samsoe","sandqvist","sandro","sarah lavoine","schott nyc","scotch and soda","sebago","sebastien blondin","selected","serafini","sherif cherry","shoes like pottery","six sept","smythson","sperry","spharell we are","stetson","stutterheim","suigeneric","sundek","sunspel","super","sweet pants","swims","t by alexander wang","tateossian","ted baker","teva","the kase","the kooples","the kooples sport","the north face","the suits","thierry lasry","thom browne","thom krom","three animals","timberland","time for wood","toka toka","tom dixon","tom wood","tommy hilfiger","toui2","triwa","tumi","tweety","u boat","ugg","ugo cacciatori","under armour","uniform wares","united uniforms","urbanears","ursul","vague lame","valentino","vans","veja","vicomte a","victorinox swiss army","vilebrequin","ville de paris","void watches","voluspa","vuarnet","wait","want les essentiels","we wood","wednesday whiskey","welton","white mountaineering","woolrich","wooyoungmi","wrangler","y 3","y-3","ymc","yves salomon","zespa","ziiiro"];

var categories = [
  'swim shorts',
  'shorts',
  'overshirt',
  'over-shirt',
  'shirt',
  'pants',
  'accessory',
  'costume',
  'knitwear',
  'tie',
  'sportswear',
  'top',
  'underwear',
  'V-neck',
  'uniform',
  'socks',
  'Baby Grow',
  'Bag',
  'Belt',
  'Bikini',
  'Blazer',
  'Blouse',
  'Boots',
  'Bow Tie',
  'Boxers',
  'Bra',
  'Briefs',
  'Camisole',
];

var prices = ["ALL","AFN","ARS","AWG","AUD","AZN","BSD","BBD","BYR","BZD","BMD","BOB","BAM","BWP","BGN","BRL","BND","KHR","CAD","KYD","CLP","CNY","COP","CRC","HRK","CUP","CZK","DKK","DOP","XCD","EGP","SVC","EUR","FKP","FJD","GHS","GIP","GTQ","GGP","GYD","HNL","HKD","HUF","ISK","INR","IDR","IRR","IMP","ILS","JMD","JPY","JEP","KZT","KPW","KRW","KGS","LAK","LBP","LRD","MKD","MYR","MUR","MXN","MNT","MZN","NAD","NPR","ANG","NZD","NIO","NGN","KPW","NOK","OMR","PKR","PAB","PYG","PEN","PHP","PLN","QAR","RON","RUB","SHP","SAR","RSD","SCR","SGD","SBD","SOS","ZAR","KRW","LKR","SEK","CHF","SRD","SYP","TWD","THB","TTD","TRY","TVD","UAH","GBP","USD","UYU","UZS","VEF","VND","YER","ZWD","Lek","؋","$","ƒ","$","ман","$","$","p.","  BZ$","$","$b","KM","P","лв","R$","$","៛","$","$","$","¥","$","₡","kn","₱","Kč","kr","RD$","$","£","$","€","£","$","¢","£","Q","£","$","L","$","Ft","kr","Rp","﷼","£","₪","J$","¥","£","лв","₩","₩","лв","₭","£","$","ден","RM","₨","$","₮","MT","$","₨","ƒ","$","C$","₦","₩","kr","﷼","₨","B/.","Gs","S/.","₱","zł","﷼","lei","руб","£","﷼","Дин.","  ₨","$","$","S","R","₩","₨","kr","CHF","$","£","NT$","฿","TT$","$","₴","£","$","$U","лв","Bs","₫","﷼","Z$"];

var cat2 = ["Cardigan","Cargos","Chemise","Coat","Cufflinks","Cummerbund","Dress","Corset","Dungarees","Fleece","Gloves","Hat","Hoody","Jacket","Jeans","Jewellery","Jogging pants","Jogging suit","Joggers","Jumper","Kaftan","Kilt","Knickers","Lingerie","Nightwear","Overall","Pashmina","Polo Shirt","Polo","Poncho","Pyjamas","Robe","Romper","Sandals","Scarf","Shawl","Shirt","Shellsuit","Shoes","Skirt","Slippers","Stockings","Suit","Sunglasses","Sweatwear","Sweatshirt","Swimming Costume","Swimming Trunks","Swimwear","T-Shirt","Tailcoat","Tights","top","Tracksuit","Trainers","Trousers","Vest","Vest Underwear","Waistcoat","Waterproof"];
var shoes = [
  "Ballet flat",
  "Sneakers",
  "Ballet shoe",
  "Brogues",
  "Derby",
  "Loafers",
  "Oxfords",
  "Slippers",
  "Oxford shoes",
  "Boots",
  "moccasins",
  "Fashion boots"
];


module.exports = {
  runTest: function () {

    d.addWord('adobe', true);
    d.addWord('ax', true);
    d.addWord('bobbyy', false);

    var x = d.save();
    d.load(x);

    d.removeWord('adobe');


   /* var f = new FBrand(pgq);
    f.initDictionary(function () {
      f.dict.addArray(brands);


      f.updateDictionary();
    });*/

   /* var f = new FCategory(pgq);
    f.initDictionary(function () {
      f.dict.addArray(cat2);
      f.dict.addArray(shoes);


      f.updateDictionary();
    });*/

   /* var f = new FPrice(pgq);
    f.initDictionary(function () {
      f.dict.addArray(prices);


      f.updateDictionary();
    });*/



    var x = d.save();
    d.load(x);

    gcapp.parse('https://marketplace.asos.com/men/sale', function cb(res) {
      var alldata = [];
      for (var i = 0; i < res.length; ++i) {
        if (res[i][0]) {
          alldata = alldata.concat(res[i][0]);
        }
      }

      var cl = new Classify(pgq, gcapp.images);

      cl.loadFeatures(function complete (){
        var r = cl.analyzeList(alldata);
      });



      console;
      });

  }
}
