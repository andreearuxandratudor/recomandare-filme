<template>
  <div>
    <div id="startpage" v-if="startPage">
      <button type="button" class="btn btn-primary" @click = "startPage = false; showType = true;">GET STARTED</button>
    </div>
    
    <div id="type" v-if="showType">
      <h1>Type:</h1>
        <div class="checkbox" v-for="type in movieTypes">
          <input type="checkbox" :id="type.id" :value="type.id" v-model="searchParams.checkedMovieTypes">
          <label :for="type.id">{{type.name}}</label>
        </div>
      <button type="button" class="btn btn-primary" @click = "showType = false; showYear = true;">Next</button>
    </div>

    <div id="year" v-if="showYear">
      <h1>Year:</h1>
      <span>From</span>
      <select v-model="searchParams.startDate">
        <option value=0>Any</option>
        <option v-for="year in years">{{year}}</option>
      </select>
      <span>To</span>
      <select v-model="searchParams.endDate">
        <option value=0>Any</option>
        <option v-for="year in years">{{year}}</option>
      </select>
      <button type="button" class="btn btn-primary" @click = "showYear = false; showType = true;">Back</button>
      <button type="button" class="btn btn-primary" @click = "formatYears(); showYear = false; showActors = true;">Next</button>
    </div>

    <div id="actors" v-if="showActors">
      <h1>Actors:</h1>
      <input v-model="actorName">
      <button type="button" class="btn btn-primary" @click = "addActor(actorName)">plus</button>
      Added actors:
      <ul v-for="actor in actors">
        <li>{{actor}}</li>
      </ul>
      <button type="button" class="btn btn-primary" @click = "showActors = false; showYear = true;">Back</button>
      <router-link :to="{ path: 'results', query: searchParams}">Go</router-link>
    </div>

  </div>
</template>

<script>
import MoviesService from "../services/MoviesService";

export default {
  name: "Home",
  data() {
    return {
      movieTypes: [],
      years: [],
      actorName: "",
      actors: [],
      searchParams: {
        checkedMovieTypes: [],
        startDate: 0,
        endDate: 0,
        actors: []
      },
      startPage: true,
      showType: false,
      showYear: false,
      showActors: false
    };
  },
  created() {
    this.getMovieTypes();
    this.generateYears();
  },
  methods: {
    getMovieTypes() {
      return MoviesService.getTypes().then(response => {
        this.movieTypes = response.data.genres;
      });
    },
    generateYears() {
      for (let i = 1900; i < 2021; i += 5) {
        this.years.push(i);
      }
    },
    formatYears() {
      this.searchParams.startDate =
        this.searchParams.startDate !== 0
          ? this.searchParams.startDate + "-01-01"
          : "1900-01-01";
      this.searchParams.endDate =
        this.searchParams.endDate !== 0
          ? this.searchParams.endDate + "-01-01"
          : this.getCurrentDate();
    },
    getCurrentDate() {
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      dateObj = year + "-" + month + "-" + day;
      return dateObj;
    },
    addActor(actorName) {
      let actor = {};
      MoviesService.getActorId(actorName).then(response => {
        let results = response.data.total_results;
        if (results > 0) {
          actor.id = response.data.results[0].id;
          actor.name = response.data.results[0].name;
          this.searchParams.actors.push(actor.id);
          this.actors.push(actor.name);
        } else if (results === 0) {
          console.log("No results found for " + actorName);
        } else {
          console.log("Please be more specific");
        }
      });
      this.actorName = "";
      console.log(this.searchParams);
    }
  }
};
</script>

<style>

body{
  background: url("../assets/background1.jpeg") no-repeat center center fixed;
  background-size: cover;
}

</style>
