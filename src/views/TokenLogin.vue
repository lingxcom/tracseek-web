<template>
</template>

<script setup>
	import { ref, computed,onMounted,onUnmounted  } from 'vue';
	import { useRoute, useRouter } from "vue-router";
	import api from '@/hooks/api'
	const router = useRouter();
	const route = useRoute()
	onMounted(()=>{
		let token=route.query.token;
		console.log(token)
		api.callApi({apicode:8012,token:token},function(json){
		if(json.code==1){
			 sessionStorage.setItem("userid",json.id);
			 sessionStorage.setItem("userName",json.name);
			 sessionStorage.setItem("isLogin","true");
			 sessionStorage.setItem("token",json.token);
			 sessionStorage.setItem("auth",json.auth);
			 router.push("/main/home");
		}else{
			 router.push("/login")
		}
		});
	});
</script>

<style>
</style>
