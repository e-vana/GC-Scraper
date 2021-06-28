<template>
<div>
    <div v-if="!isLoading" class="keyword-card">
      <span class="keyword-card-keyword">{{keyword}}</span>
      <span class="keyword-card-lastUpdated">Last Updated @ {{lastUpdated}}</span>
      <span>
        <router-link class="routerLink" :to="fullRoute">
          <button class="btn-results">results</button>
        </router-link>
        <button class="btn-delete" @click="deleteKeyword">delete</button>
      </span>
    </div>
  <div v-if="isLoading" class="keyword-card__loading">
    <span class="keyword-card-keyword">{{keyword}}</span>

    <div v-if="isLoading" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    <button class="btn-delete" @click="deleteKeyword">delete</button>


  </div>
</div>

</template>

<script>
import axios from 'axios'
export default {
  data(){
    return {
      isLoading: false
    }
  },
  computed: {
    fullRoute: function() {
      return '/keyword/'+this.id;  
    }
  },
  created: function(){
    if(this.lastUpdated == undefined){
      this.isLoading = true;
    }
  },
  methods: {
    deleteKeyword: async function(){
      try {
        let payload = {
          id: this.id
        }
        let deleteKeyword = await axios.post(process.env.VUE_APP_API_URL+'/scrapes/delete', payload);
        if(deleteKeyword){
          await this.$store.dispatch('fetchKeywords');
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  props: {
    keyword: String,
    lastUpdated: String,
    results: Number,
    id: String
  }
}
</script>

<style>

.routerLink {
    text-decoration: none;
}

.keyword-card {
  background-color: rgb(207, 212, 231);
  color: rgb(43, 57, 122);
  padding: 10px 20px;
  border-radius: 5px;
  margin: 0px 0px 10px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

}
.keyword-card-keyword {
  width: 150px;
}


.btn-delete {
  background-color: rgb(137, 152, 216);
  color: rgb(43, 57, 122);
  font-weight: bold;
  border-radius: 11px;
  padding: 5px 20px;
  text-align: center;
  margin-left: 10px;
  border: none;
}
.btn-delete:hover {
  color: rgb(251, 252, 255);
  cursor: pointer;
}

.btn-results {
  background-color: rgb(104, 118, 182);
  color: rgb(255, 255, 255);
  border-radius: 11px;
  padding: 5px 20px;
  margin-left: 10px;
  text-align: center;
  transition: ease-in-out .1s all;
  border: none;
}

.btn-results:hover {
  background-color: rgb(255, 255, 255);
  color: rgb(104, 118, 182);
  border-radius: 11px;
  padding: 5px 20px;
  margin-left: 10px;
  text-align: center;
  cursor: pointer;
}

.keyword-card-lastUpdated {
  font-size: 12px;
}

.keyword-card__loading {
  cursor: wait;
  background-color: rgb(179, 183, 197);
  color: rgb(43, 57, 122);
  padding: 10px 20px;
  border-radius: 5px;
  margin: 0px 0px 10px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 32px;
}
.lds-ellipsis div {
  position: absolute;
  top: 10px;
  width: 13px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}


</style>