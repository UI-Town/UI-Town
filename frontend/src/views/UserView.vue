<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import {onMounted, Ref, ref} from "vue";
import {useRouter} from "vue-router";
import {notifications, user, playedOA} from "@/globs";
import {CSSStyle, updateUser} from "@/constants";
import {getCSSByIds, getUserById, getValidCSSIds} from "@/api";
import DisplayMenu from "@/components/DisplayMenu.vue";

let router = useRouter();

let works = ref<CSSStyle[]>([]);

onMounted(async () => {
  if (user.value === undefined) {
    playedOA.value = true;
    notifications.push({message: "Please login first", color: 'red'});
    await router.push('/');
    return;
  }

  let workIDs = await getValidCSSIds({author_id: user.value.id});
  if (workIDs.length > 0) {
    works.value = await getCSSByIds(workIDs);
  }
});

const description_default = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How razorback-jumping frogs can level six piqued gymnasts! Grumpy wizards make toxic brew for the evil queen and jack. Jived fox nymph grabs quick waltz. Cozy lummox gives smart squid who asks for job pen.";

let nameInput = ref() as Ref<HTMLInputElement>;
let descriptionBox = ref() as Ref<HTMLTextAreaElement>;
let iconInput = ref() as Ref<HTMLInputElement>;

const patchUser = async (mode: 'name' | 'description' | 'icon') => {
  if (user.value === undefined) {
    return;
  }

  let body: {
    id: number,
    password_hashed: string,
    name?: string,
    description?: string,
    icon?: string,
    icon_type?: string,
  } = {
    id: user.value.id,
    password_hashed: user.value.password_hashed,
  };

  if (mode === 'name') {
    body.name = nameInput.value.value;
  } else if (mode === 'description') {
    body.description = descriptionBox.value.value;
  } else {
    let file = iconInput.value.files?.[0];
    if (file !== undefined) {
      let reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          let arrayBuffer = reader.result as ArrayBuffer;
          let byteArray = new Uint8Array(arrayBuffer);
          body.icon = btoa(byteArray.reduce((s: string, v: number) => s + String.fromCharCode(v), ""));
          body.icon_type = file.name.match(/\..*$/)?.[0] ?? '';
          resolve();
        }
        reader.readAsArrayBuffer(file);
      });
    } else {
      notifications.push({message: "Selected file is undefined!"});
      return;
    }
  }

  let res = await fetch("api/users", {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  await updateUser();

  if (!res.ok) {
    notifications.push({message: (await res.json() as {error: string}).error});
    return;
  }
}

</script>

<template>
<!--  <div class="absolute top-0 w-full">-->
<!--    <NavigationBar/>-->
<!--  </div>-->
  <div v-if="user !== undefined" class="max-w-screen-lg bg-[linear-gradient(90deg,#004aad55,#cb6ce655)] h-screen mx-auto flex flex-col justify-start items-stretch lg:px-28 px-5 text-white overflow-scroll">
    <div class="mt-20 flex w-full">
      <input type="file" accept="image/*" class="hidden" ref="iconInput" @change="() => patchUser('icon')"/>
      <!--TODO you need to implement the actual profile picture-->
      <svg @click="() => iconInput.click()" v-if="user.icon === null" xmlns="http://www.w3.org/2000/svg" height="100%" fill="currentColor" class="cursor-pointer bi bi-person-fill aspect-square h-32 flex-shrink-0 border border-white" viewBox="0 0 16 16">
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
      </svg>
      <img @click="() => iconInput.click()" v-else alt="picon" :src="user.icon" class="cursor-pointer aspect-square max-h-32 min-h-32"/>

      <div class="px-5 flex flex-col justify-start flex-grow">
        <input @focusout="() => patchUser('name')" ref="nameInput" class="leading-8 text-3xl font-bold bg-transparent outline-0" :value="user.name">
        <textarea @focusout="() => patchUser('description')" ref="descriptionBox" :value="user.description === '' ? description_default : user.description" class="resize-none outline-0 w-full mt-2 ms-0.5 overflow-scroll overflow-ellipsis max-h-20 [scrollbar-width:none] leading-tight bg-transparent"/>
      </div>

      <div class="flex-shrink-0 text-2xl">
        lvl.<span class="min-w-8 inline-block text-center">1</span>
      </div>
    </div>
    <div class="flex-grow mt-16 mb-8 flex flex-col bg-[#27223055] overflow-hidden">
      <h1 class="p-3 text-3xl leading-8 bg-[#21325755] font-[Cooljazz] tracking-widest font-extralight">Exhibition</h1>
      <DisplayMenu :hasSearcher="false" class="px-6 py-6"/>
    </div>
  </div>
</template>

<style scoped>
</style>