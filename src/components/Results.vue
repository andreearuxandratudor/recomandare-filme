<template>
  <div>
    <router-link :to="{ path: '/' }">New Search</router-link>
    <h2>Results</h2>
    <div v-for="result in results" class="result">
      <h4>{{result.title}}</h4>
      <div><img :src="'http://image.tmdb.org/t/p/w185/' + result.poster_path" :alt="result.title"/></div>
      <div class="text"> {{result.overview}}</div>
  </div>
  </div>
</template>

<script>
import MoviesService from "../services/MoviesService";

export default {
  name: "Results",
  data() {
    return {
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
      console.log(this.results);
    });
  }
};
</script>

<style>
.result {
  width: 25%;
  display: inline-block;
  vertical-align: top;
  padding: 20px;
}

.text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  padding-top: 10px;

}
</style>