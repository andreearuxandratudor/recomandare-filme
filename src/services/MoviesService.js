import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);
Vue.http.options.root = 'https://api.themoviedb.org/3/';

const apiKey = '6cbdfb4f71a52638fa2f4ccf099f76f0';

export default {
  getTypes() {
    return Vue.http.get('genre/movie/list', {
      params: {
        api_key: apiKey,
        language: 'en-US'
      }
    });
  },
  getActorId(actorName) {
    return Vue.http.get('search/person', {
      params: {
        api_key: apiKey,
        query: actorName
      }
    });
  },
  getMovies(searchParams) {
    return Vue.http.get('discover/movie', {
      params: {
        api_key: apiKey,
        language: 'en-US',
        sort_by: 'vote_average.desc',
        with_original_language: 'en',
        'vote_count.gte': 100,
        'primary_release_date.gte': searchParams.release_date.gte,
        'primary_release_date.lte': searchParams.release_date.lte,
        with_people: searchParams.with_people && searchParams.with_people.length > 0 ? searchParams.with_people.toString() : '',
        with_genres: searchParams.with_genres && searchParams.with_genres.length > 0 ? searchParams.with_genres.toString() : ''
      }
    });
  },
  getCast(movieId) {
    return Vue.http.get('movie/' + movieId + '/credits', {
      params: {
        api_key: apiKey
      }
    });
  }
}