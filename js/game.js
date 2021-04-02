
function start(){

    $("#inicio").hide();
    $("#fundoGame").append("<div id='jogador' class='anima'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='vida'></div>");

    var posicaoY = getRandom(0, 334);
    var abate1 = 0.5;
    var abate2 = 0.25;
    var perda = 0.99; // perde 1% em cada morte de amigo
    var disparoPlus = 0.5;
    var v_disparo = 15;
    var v_inimigo2 = 3;
    var v_inimigo1 = 5;
    var podeAtirar = true;
    var fimdejogo = false;
    var pontos = 0;
    var resgates = 0;
    var mortes = 0;
    var correnteVida = 3;
    var jogo = {};
    var TECLA = {
        W: 38,
        S: 40,
        D: 83
    }
    jogo.pressionou = [];

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somMorteAmigo = document.getElementById("somMorteAmigo");
    var somResgate = document.getElementById("somResgate");

    // ao fim da música, executa novamente
    musica.addEventListener("ended", function(){
        musica.currentTime = 0;
        musica.play();
    }, false);
    // executa a música
    musica.play();

    $(document).keydown(function (e) { 
        jogo.pressionou[e.which] = true;
    });
    $(document).keyup(function (e) { 
        jogo.pressionou[e.which] = false;
    });

    jogo.timer = setInterval(loop, 30);

    function loop(){
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        vida();
    }

    function movefundo(){
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda-1);
    }

    function movejogador(){

        if (jogo.pressionou[TECLA.W]){
            var topo = parseInt($("#jogador").css("top"));
            var posicao = topo-10;
            if (posicao<0){posicao = 0;}
            $("#jogador").css("top", posicao);
        }
        if (jogo.pressionou[TECLA.S]){
            var topo = parseInt($("#jogador").css("top"));
            var posicao = topo+10;
            if (posicao>556){posicao = 556;}
            $("#jogador").css("top", posicao);
        }
        if (jogo.pressionou[TECLA.D]){
            disparo();
        }
    }

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function moveinimigo1(){
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX-v_inimigo1);
        $("#inimigo1").css("top", posicaoY);
        if (posicaoX<=0){
            posicaoY = getRandom(0, 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
    }

    function moveinimigo2(){
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX-v_inimigo2);
        if (posicaoX<=0){
            $("#inimigo2").css("left", 775);
        }
    }

    function moveamigo(){
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX+1);
        if (posicaoX>906){
            $("#amigo").css("left", 0);
        }
    }

    function disparo() {

        if (podeAtirar==true) {

            podeAtirar = false;

            topo = parseInt($("#jogador").css("top")); // posição do jogador
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;

            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30);

            somDisparo.play();
        }

        function executaDisparo() {

            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX+v_disparo);

            if (posicaoX>900){
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    function colisao() {

        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

        // colide inimigo1
        if (colisao1.length>0){

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
            posicaoY = getRandom(0, 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
            correnteVida--;
        }

        // colide inimigo2
        if (colisao2.length>0){

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);
            $("#inimigo2").remove();
            reposicionaInimigo2();
            correnteVida--;
        }

        // disparo no inimigo 1
        if (colisao3.length>0){

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);
            posicaoY = getRandom(0, 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
            pontua("abate1");
        }

        // disparo no inimigo2
        if (colisao4.length>0){

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);
            reposicionaInimigo2();
            pontua("abate2");
        }

        // resgata amigo
        if (colisao5.length>0){
            
            reposicionaAmigo();
            $("#amigo").remove();
            resgates++;
            somResgate.play();
            pontua("resgate");
        }

        // amigo abatido
        if (colisao6.length>0){

            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();
            reposicionaAmigo();
            mortes++;
            pontua("perda");
        }
    }

    function explosao1(inimigo1X, inimigo1Y) {

        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(img/explosion.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao(){
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }

        somExplosao.play();
    }

    function explosao2(inimigo2X, inimigo2Y) {

        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image", "url(img/explosion.png)");
        var div = $("#explosao2");
        div.css("top", inimigo2Y);
        div.css("left", inimigo2X);
        div.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2(){
            div.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }

        somExplosao.play();
    }

    function explosao3(amigoX, amigoY) {

        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        var tempoExplosao3 = window.setInterval(removeExplosao3, 1000);

        function removeExplosao3(){
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }

        somMorteAmigo.play();
    }

    function reposicionaInimigo2(){
        
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4(){
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;
            if (fimdejogo == false){
                $("#fundoGame").append("<div id='inimigo2'></div>");
            }
        }
    }

    function reposicionaAmigo(){
        
        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6(){
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            if (fimdejogo == false){
                $("#fundoGame").append("<div id='amigo' class='anima'></div>");
            }
        }
    }

    function placar(){
        $("#placar").html("<div class='text pontos'>Pontos: " + pontos + "</div><div class='text resgates'><i class='fas fa-user-nurse' title='resgatados'></i> " + resgates + "</div><div class='text mortes'><i class='fas fa-skull-crossbones' title='mortos'></i> " + mortes + "</div>");
    }

    function vida(){

        if (correnteVida == 3){
            // $("#vida").css("background-image", "url(img/energy3.png)");
            $("#vida").html("<i class='fas fa-heart full'><i class='fas fa-heart full'><i class='fas fa-heart full'>");
        }
        if (correnteVida == 2){
            // $("#vida").css("background-image", "url(img/energy2.png)");
            $("#vida").html("<i class='far fa-heart empty'><i class='fas fa-heart full'><i class='fas fa-heart full'>");
        }
        if (correnteVida == 1){
            // $("#vida").css("background-image", "url(img/energy1.png)");
            $("#vida").html("<i class='far fa-heart empty'><i class='far fa-heart empty'><i class='fas fa-heart full'>");
        }
        if (correnteVida == 0){
            // $("#vida").css("background-image", "url(img/energy0.png)");
            $("#vida").html("<i class='far fa-heart empty'><i class='far fa-heart empty'><i class='far fa-heart empty'>");
            gameOver();
        }
    }

    function gameOver() {

        fimdejogo = true;
        musica.pause();
        somGameover.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#amigo").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html("<h1 class='end-game'>Fim do Jogo</h1><p class='points'>" + pontos + " pontos</p><div id='reinicia' onClick='reiniciaJogo()'><p class='game-start'>INICIAR</p></div>");
    }

    function pontua(action){
        
        // disparo no inimigo1
        if (action=="abate1"){
            pontos += 100;
            v_inimigo1 += abate1;
            v_disparo += disparoPlus;
        }

        // disparo no inimigo2
        if (action=="abate2"){
            pontos += 50;
            v_inimigo2 += abate2;
            v_disparo += disparoPlus;
        }

        // resgata amigo
        if (action=="resgate"){
            pontos += 50;
            v_disparo += disparoPlus;
        }

        // perde amigo
        if (action=="perda"){
            pontos = parseInt(pontos * perda);
            v_disparo -= disparoPlus;
        }
    }
}

function reiniciaJogo(){
    somGameover.pause();
    $("#fim").remove();
    start();
}