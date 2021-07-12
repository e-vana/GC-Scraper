<template>
  <div class="home">
    <div class="container">
      <div>
        <h2>Guitar Center Scraper</h2>
        <p>This application is a web scraper that scrapes the guitarcenter.com used section for certain keywords.  You can setup alerts to be notified when a keyword matches a certain price threshold.  The scraping is run several times an hour to maintain an approximate representation of the classified sections.</p>
        <p>You can add a keyword using the input field below to submit a keyword to the scraping queue.  The next scraping cycle will include this keyword in its process and will update when the data is available.</p>
        <p>Want to learn more about this project?  Visit the github repository here.</p>
      </div>

      <div class="mt-5" v-if="$store.getters.getKeywords.length > 0">
        <h4>Current Keywords</h4>

        <div class="mb-3">
          <transition name="fade" mode="out-in">
            <code :key="lastUpdated">Last Retrieved @ {{lastUpdated}}</code>
          </transition>
        </div>

        <KeywordCard v-for="keyword in $store.getters.getKeywords" :key="keyword._id"
          :keyword="keyword.keyword"
          :lastUpdated="keyword.lastUpdated"
          :id="keyword._id"
          :results="keyword.results">
        </KeywordCard>
      </div>
      <div class="mt-5">
        <h4>Add a keyword to scrape for</h4>
        <p>Type a keyword you want to add to the scraper.  Please complete the captcha to complete the process of adding a keyword.</p>
        <b-input type="text" v-model="searchKeyword" placeholder="What keyword do you want to add to the scraper?"></b-input>
        <b-alert class="mt-4" show v-if="isError" variant="danger" >{{errorMessage}}</b-alert>
        <b-alert class="mt-4" show v-if="isSuccess" variant="success" >{{successMessage}}</b-alert>
        <button @click="addKeyword" class="btn-add mt-3">Add a Keyword</button>
      </div>

    </div>

  </div>
</template>

<script>
import axios from 'axios'
import KeywordCard from '../components/KeywordCard.vue'

export default {
  name: 'Home',
  components: {
    KeywordCard
  },
  data(){
    return {
      searchKeyword: '',
      currentScrapeKeywords: [],
      isError: false,
      errorMessage: '',
      isSuccess: false,
      successMessage: '',
      lastUpdated: ''
    }
    
  },
  created: function(){
    this.goFetch();

    setInterval(() => {
      this.goFetch()
    }, 10000)
  },
  methods: {
    goFetch: function(){
      this.$store.dispatch('fetchKeywords');
      let lastUpdated = new Date();
      this.lastUpdated = lastUpdated.toTimeString();
    },
    addKeyword: async function(){
      try {
        let payload = {
          keyword: this.searchKeyword
        }
        let response = await axios.post(process.env.VUE_APP_API_URL+'/scrapes', payload, {headers: {"Content-Type": "application/json"}});
        console.log(response);
        if(response){
          this.isError = false;
          this.isSuccess = true;
          this.successMessage = 'Your keyword was succesfully added to the scrape queue.';
          this.searchKeyword = '';
          await this.$store.dispatch('fetchKeywords');
        }
      } catch (error) {
        this.isSuccess = false;
        this.isError = true;
        if(error.response.data.message){
          this.errorMessage = error.response.data.message;
        }else {
          this.errorMessage = "There was an error handling this request.";
        }
      }
    }
  }
}
</script>

<style>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.container {
  margin-top: 50px;
}

.btn-add {
  background-color: rgb(137, 152, 216);
  color: rgb(43, 57, 122);
  font-weight: bold;
  border-radius: 11px;
  padding: 10px 20px;
  text-align: center;
  border: none;
  transition: all .3s ease-in-out;
}
.btn-add:hover {
  color: rgb(251, 252, 255);
  cursor: pointer;
}
</style>
