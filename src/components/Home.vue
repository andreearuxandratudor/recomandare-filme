<template>
  <div>
    <div id="startpage" v-if="startPage">
      <button type="button" id="get-started" @click = "startPage = false; showType = true;"><span>GET STARTED</span></button>
    </div>
    
    <div id="type" v-if="showType">
      <div id="movie-types-container">
        <h2>Types:</h2>
          <div class="checkbox" v-for="type in movieTypes">
            <input type="checkbox" :id="type.id" :value="type.id" v-model="searchParams.checkedMovieTypes">
            <label :for="type.id">{{type.name}}</label>
          </div>
          <i class="fa fa-long-arrow-right fa-2x" aria-hidden="true" @click ="showType = false; showYear = true;"></i>
      </div>
    </div>

    <div id="year" v-if="showYear">
      <div id="years-container">
      <h1 class="text-center">Year:</h1>
      <div>
      <span>From</span>
      <select v-model="searchParams.startDate">
        <option value=0 selected>Any</option>
        <option v-for="year in years">{{year}}</option>
      </select>
      <span>To</span>
      <select v-model="searchParams.endDate">
        <option value=0 selected>Any</option>
        <option v-for="year in years">{{year}}</option>
      </select>
      </div>
      <div class="actions">
        <i class="fa fa-long-arrow-left fa-2x" aria-hidden="true" @click ="showYear = false; showType = true;"></i> &nbsp;
        <i class="fa fa-long-arrow-right fa-2x" aria-hidden="true" @click ="formatYears(); showYear = false; showActors = true;"></i>
      </div>
      </div>
    </div>

    <div id="actors" v-if="showActors">
      <div id="actors-container">
        <h1>Actors:</h1>
        <input v-model="actorName" v-on:keyup.13 = "addActor(actorName)">
        <i class="fa fa-plus" aria-hidden="true" @click = "addActor(actorName)"></i>
        <ul>
          <li v-for="actor in actors">{{actor}}</li>
        </ul>
        <div class="actions">
          <i class="fa fa-long-arrow-left fa-2x" aria-hidden="true" @click ="showActors = false; showYear = true;"></i> &nbsp;
          <router-link id="go" :to="{ path: 'results', query: searchParams}" > <i class="fa fa-plane" aria-hidden="true"></i> Let's go! </router-link>
        </div>
      </div>
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
      this.years.push(2018);
      for (let i = 2015; i >= 1900; i -= 5) {
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
#startpage,
#type,
#year,
#actors {
  background: url("../assets/background1.jpg") no-repeat center center fixed;
  background-size: cover;
  height: -webkit-fill-available;
}

#get-started {
  position: relative;
  top: 43%;
  padding: 0;
  border-radius: 8px;
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  font-size: 40px;
}

#get-started span {
  display: inline-block;
  padding: 20px 30px;
  color: #fff;
  background-color: #d60000;
  background-image: -webkit-linear-gradient(
    hsla(0, 87%, 30%, 0.5),
    hsla(360, 100%, 32%, 0.8)
  );
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
}
#get-started:hover span {
  background-color: #a43c40;
  text-shadow: 0 -1px 1px rgba(255, 240, 242, 1),
    0 0 5px rgba(255, 255, 245, 0.8);
}

#type {
  display: flex;
  align-items: center;
  padding-left: 42%;
}

#year {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#actors {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#movie-types-container {
  text-align: left;
  padding: 5px 20px 5px 30px;
  background-image: -webkit-linear-gradient(
    hsla(204, 79%, 38%, 0.8),
    hsla(211, 59%, 19%, 0.8)
  );
  box-shadow: inset 0 10px 15px rgba(0, 0, 0, 0.125);
  border-radius: 10px;
  color: #fff;
}

#years-container, #actors-container {
  text-align: left;
  padding: 20px;
  background-image: -webkit-linear-gradient(
    hsla(204, 79%, 38%, 0.8),
    hsla(211, 59%, 19%, 0.8)
  );
  box-shadow: inset 0 10px 15px rgba(0, 0, 0, 0.125);
  border-radius: 10px;
  color: #fff;
  margin-top: 18%;
}

#year select, #actors input {
  color: black;
}

#actors ul {
  list-style-type: none;
  text-align: left;
  padding: 10px;
}
.fa-long-arrow-right {
  float: right;
  cursor: pointer;
}
.fa-long-arrow-left {
  float: left;
  cursor: pointer;
}

select option {
    height: 100px !important;
}

.actions #go {
  float: right;
  cursor: pointer;
  color: #fff;
  padding-top: 5px;
}
.actions #go:hover {
  text-decoration: none;
}


</style>
