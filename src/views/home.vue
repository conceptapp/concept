/*

### Component ###
This component displays the landing homepage

## Props ##

## Behavior ##

*/

<template>
  <body>
    <header class="masthead text-center text-white">
      <div class="masthead-content">
        <div class="container">
          <h1 class="masthead-heading mb-0">Concept, version digitale</h1>
          <h2 class="masthead-subheading mb-0">Et ça décoiffe du poney au petit matin</h2>
          <a href="#whatisconcept" class="btn btn-primary btn-xl rounded-pill mt-5">En savoir plus</a>
        </div>
      </div>
      <div class="bg-circle-1 bg-circle"></div>
      <div class="bg-circle-2 bg-circle"></div>
      <div class="bg-circle-3 bg-circle"></div>
      <div class="bg-circle-4 bg-circle"></div>
    </header>

    <section>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5 order-lg-2">
            <div class="p-5">
              <img class="img-fluid rounded-circle" :src="require('@/assets/images/play-conceptphoto.jpg')" alt="">
            </div>
          </div>
          <div id="whatisconcept" class="col-lg-7 order-lg-1">
            <div class="p-5">
              <h2 class="display-4">C'est quoi <i>Concept</i> ?</h2>
              <p>Concept est un jeu de société sur plateau. Le but est de faire découvrir aux autres joueurs un mot proposé par le jeu. Pour cela, le joueur dispose uniquement du jeu d'icônes symboliques présentes sur le plateau. En associant astucieusement ces icônes sur différents <i>concepts</i>, le joueur peut ainsi faire deviner les autres joueurs.</p>
              <p class="text-center">
                <b-link href="https://amzn.to/2HRnvtq" target="_blank">
                  <b-button variant="primary" size="lg">Acheter le jeu</b-button>
                </b-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5">
            <div class="p-5">
              <img class="img-fluid rounded-circle" :src="require('@/assets/images/concept-digital.jpg')" alt="">
            </div>
          </div>
          <div class="col-lg-7">
            <div class="p-5">
              <h2 class="display-4">Et en version digitale alors ?</h2>
              <p>Ce site est un hommage à cet excellent jeu de société, il vous permet de jouer dans différentes configurations : tous autour d'une même tablette ou d'un même ordinateur, autour d'une même "partie virtuelle" où tout le monde voit les cartes proposés sur son ordinateur, tablette ou smartphone (que vous soyiez au même endroit ou non ou encore de créer des "plateaux de jeu" ou deviner ceux des autres.</p>
              <p class="text-center">
                <b-button @click="$router.push({ name: 'Mainboard' })" variant="primary" size="lg">Découvrir le plateau</b-button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5 order-lg-2">
            <div class="p-5">
              <img class="img-fluid rounded-circle" :src="require('@/assets/images/play-multiplayers-square.jpg')" alt="">
            </div>
          </div>
          <div class="col-lg-7 order-lg-1">
            <div class="p-5">
              <h2 class="display-4">Jouer à plusieurs en même temps...</h2>
              <p>Cette version digitale de <i>Concept</i> vous propose le plateau d'icônes du jeu de société, vous pouvez l'utiliser comme sur le jeu physique pour faire deviner des mots. Piochez des mots au hasard (pensez à masquer votre écran) en cliquant sur la carte <i>Concept</i> et lancez-vous&nbsp;!</p>
              <p class="text-center">
                <b-button @click="$router.push({ name: 'Mainboard' })" variant="primary" size="lg">Jouer en live</b-button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5">
            <div class="p-5">
              <img class="img-fluid rounded-circle" :src="require('@/assets/images/play-singleplayer-square.jpg')" alt="">
            </div>
          </div>
          <div class="col-lg-7">
            <div class="p-5">
              <h2 class="display-4">... ou chacun son tour</h2>
              <p>Grâce à cette version digitale, vous pouvez construire des plateaux de jeu avec des icônes associées à chaque ligne de concept. L'objectif reste identique : faire deviner des mots aux autres joueurs.</p>
              <p>Vous pouvez également tentez de découvrir les mots cachés par les plateaux créés par les autres joueurs. Pour accéder à ce mode de jeu, vous devez vous connecter.</p>
              <p class="text-center">
                <b-button @click="$router.push({ name: 'Mainboard' })" variant="primary" size="lg">Se connecter</b-button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-5 bg-black">
      <div class="container">
        <p class="m-0 text-center text-white small">Copyright &copy; Concept Digital 2019</p>
      </div>
      <!-- /.container -->
    </footer>
  </body>
</template>

<script>
// import { mapState, mapGetters } from 'vuex'
// import { EventBus } from '@/event-bus.js'
// import $socket from '@/websocket-instance'

export default {
  name: 'Home',
  components: {  },
  // data: function () { }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*!
 * Start Bootstrap - One Page Wonder v5.0.4 (https://startbootstrap.com/template-overviews/one-page-wonder)
 * Copyright 2013-2019 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-one-page-wonder/blob/master/LICENSE)
 */

body {
  font-family: 'Lato';
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Catamaran';
  font-weight: 800 !important;
}

.btn-xl {
  text-transform: uppercase;
  padding: 1.5rem 3rem;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
}

.bg-black {
  background-color: #000 !important;
}

.rounded-pill {
  border-radius: 5rem;
}

header.masthead {
  position: relative;
  overflow: hidden;
  padding-top: calc(7rem + 72px);
  padding-bottom: 7rem;
  background: -webkit-gradient(linear, left bottom, left top, from(#ff6a00), to(#ee0979));
  background: linear-gradient(0deg, #ff6a00 0%, #ee0979 100%);
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: scroll;
  background-size: cover;
}

header.masthead .masthead-content {
  z-index: 1;
  position: relative;
}

header.masthead .masthead-content .masthead-heading {
  font-size: 4rem;
}

header.masthead .masthead-content .masthead-subheading {
  font-size: 2rem;
}

header.masthead .bg-circle {
  z-index: 0;
  position: absolute;
  border-radius: 100%;
  background: -webkit-gradient(linear, left bottom, left top, from(#ee0979), to(#ff6a00));
  background: linear-gradient(0deg, #ee0979 0%, #ff6a00 100%);
}

header.masthead .bg-circle-1 {
  height: 90rem;
  width: 90rem;
  bottom: -55rem;
  left: -55rem;
}

header.masthead .bg-circle-2 {
  height: 50rem;
  width: 50rem;
  top: -25rem;
  right: -25rem;
}

header.masthead .bg-circle-3 {
  height: 20rem;
  width: 20rem;
  bottom: -10rem;
  right: 5%;
}

header.masthead .bg-circle-4 {
  height: 30rem;
  width: 30rem;
  top: -5rem;
  right: 35%;
}

@media (min-width: 992px) {
  header.masthead {
    padding-top: calc(10rem + 55px);
    padding-bottom: 10rem;
  }
  header.masthead .masthead-content .masthead-heading {
    font-size: 6rem;
  }
  header.masthead .masthead-content .masthead-subheading {
    font-size: 4rem;
  }
}

.bg-primary {
  background-color: #ee0979 !important;
}

.btn-primary {
  background-color: #ee0979;
}

.btn-primary:active, .btn-primary:focus, .btn-primary:hover {
  background-color: #bd0760 !important;
  border-color: #bd0760 !important;
}

.btn-primary:focus {
  -webkit-box-shadow: 0 0 0 0.2rem rgba(238, 9, 121, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(238, 9, 121, 0.5);
}

.btn-secondary {
  background-color: #ff6a00;
  border-color: #ff6a00;
}

.btn-secondary:active, .btn-secondary:focus, .btn-secondary:hover {
  background-color: #cc5500 !important;
  border-color: #cc5500 !important;
}

.btn-secondary:focus {
  -webkit-box-shadow: 0 0 0 0.2rem rgba(255, 106, 0, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 106, 0, 0.5);
}
</style>
