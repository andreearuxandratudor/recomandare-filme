<template>
  <div id="results">
      <div v-if="results.length>0">
        <router-link id="go" :to="{ path: '/' }" > <i class="fa fa-plane" aria-hidden="true"></i> New Search! </router-link>
        <h2>Results</h2>
        <div v-for="result in results" class="result">
          <h4>{{result.title}}</h4>
          <div><img :src="'http://image.tmdb.org/t/p/w185/' + result.poster_path" :alt="result.title"/></div>
          <div class="text"> {{result.overview}}</div>
          <div class="important-text">
            Cast: <span v-for="castMember in result.cast">{{castMember.name}}; </span>
          </div>
          <div class="important-text">
             <div v-if="result.director && result.director.name">Director: {{result.director.name}}</div>
             <div v-if="result.writer && result.writer.name">Writer: {{result.writer.name}}</div>
          </div>
          <div class="important-text release-date">Release Date: {{result.release_date}}</div>
        </div>
      </div>

      <div v-else id="no-results">
        <div v-if="movieCallEnded">
          <h2>Sorry, we did not find anything for you. Please, refine your search!</h2>
          <router-link id="go" :to="{ path: '/' }" > <i class="fa fa-plane" aria-hidden="true"></i> New Search! </router-link>
        </div>
        <i v-else class="fa fa-spinner fa-5x" aria-hidden="true"></i>
      </div>
  </div>
</template>

<script>
import MoviesService from "../services/MoviesService";

export default {
  name: "Results",
  data() {
    return {
      movieCallEnded: false,
      results: {},
      searchParams: {
        release_date: {},
        with_genres: [],
        with_people: []
      }
    };
  },
  mounted() {
    this.searchParams.release_date.gte = this.$route.query.startDate;
    this.searchParams.release_date.lte = this.$route.query.endDate;
    this.searchParams.with_genres = this.$route.query.checkedMovieTypes;
    this.searchParams.with_people = this.$route.query.actors;
    MoviesService.getMovies(this.searchParams).then(response => {
      this.results = response.data.results.slice(0, 12);
      this.results.forEach(result => {
        MoviesService.getCast(result.id).then(castResponse => {
          result.cast = castResponse.body.cast.filter(function(castMember) {
            return castMember.order < 3;
          });
          result.director = castResponse.body.crew.filter(function(crewMember) {
            return crewMember.job === "Director";
          });
          if (result.director.length > 0) {
            result.director = result.director[0];
          }
          result.writer = castResponse.body.crew.filter(function(crewMember) {
            return crewMember.job === "Writer";
          });
          if (result.writer.length > 0) {
            result.writer = result.writer[0];
          }
          this.$forceUpdate();
        });
      });
      this.movieCallEnded = true;
    });
  }
};
</script>

<style>
body {
  background: url("../assets/background1.jpg") no-repeat center center fixed;
  background-size: cover;
  height: -webkit-fill-available;
}
.result {
  position: relative;
  width: 24%;
  display: inline-block;
  vertical-align: top;
  padding: 20px;
  background-image: -webkit-linear-gradient(
    hsla(204, 79%, 38%, 0.9),
    hsla(211, 60%, 19%, 0.9)
  );
  margin: 4px;
  color: #fff;
  min-height: 700px;
}

.result h4{
  text-shadow: 3px 2px 4px #132f4de6;
}

.text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  padding-top: 15px;
  line-height: 160%;
}

.important-text {
  font-weight: 600;
  padding-top: 30px;
}

.release-date {
  position: absolute;
  bottom: 10px;
  text-align: center;
}

h2 {
  color: #fff;
  text-shadow: 3px 2px 4px #132f4de6;
}

#results #go {
  cursor: pointer;
  color: #fff;
  font-size: 22px;
}
#results #go:hover {
  text-decoration: none;
}

#no-results div {
  margin-top: 18%;
  overflow: hidden;
  background-image: -webkit-linear-gradient(
    hsla(204, 79%, 38%, 0.9),
    hsla(211, 60%, 19%, 0.9)
  );
  padding: 20px;
}
#no-results i {
  margin-top: 5%;
  color: #fff;
}

@media screen and (max-width: 1200px){
  .result{
    width: 32%;
  }
}

@media screen and (max-width: 900px){
  .result{
    width: 49%;
    min-height: 650px;
  }
}
</style>