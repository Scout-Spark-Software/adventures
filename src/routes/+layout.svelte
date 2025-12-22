<script lang="ts">
  import "../app.css";
  import type { LayoutData } from "./$types";
  import logo from "$lib/assets/Scout-Spark-Hiking.png";
  import { page } from "$app/stores";

  export let data: LayoutData;
  $: user = data.user;
  $: currentPath = $page.url.pathname;
</script>

<nav class="bg-white shadow-md sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="flex items-center gap-2 group">
            <img
              src={logo}
              alt="Scouts Adventures Logo"
              class="w-10 h-10 transition-transform group-hover:rotate-12"
            />
            <span class="text-lg font-bold text-slate-900 hidden sm:block">
              Scouts Adventures
            </span>
          </a>
        </div>
        <div class="hidden md:ml-8 md:flex md:space-x-1">
          <a
            href="/hikes"
            class="{currentPath.startsWith('/hikes')
              ? 'border-sky-600 text-slate-900'
              : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'} inline-flex items-center px-4 pt-1 border-b-2 text-sm font-semibold transition-colors"
          >
            <svg
              class="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            Hikes
          </a>
          <a
            href="/camping"
            class="{currentPath.startsWith('/camping')
              ? 'border-sky-600 text-slate-900'
              : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'} inline-flex items-center px-4 pt-1 border-b-2 text-sm font-semibold transition-colors"
          >
            <svg
              class="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Camping Sites
          </a>
        </div>
      </div>
      <div class="flex items-center gap-2">
        {#if user}
          {#if user.isAdmin}
            <a
              href="/admin"
              class="text-sky-700 hover:text-sky-800 px-3 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              Admin
            </a>
          {/if}
          <a
            href="/favorites"
            class="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Favorites
          </a>
          <a
            href="/submit"
            class="hidden sm:inline-flex text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Submit
          </a>
          <a
            href="/profile"
            class="bg-slate-100 text-slate-900 hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Profile
          </a>
        {:else}
          <a
            href="/login"
            class="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Login
          </a>
          <a
            href="/signup"
            class="bg-sky-600 text-white hover:bg-sky-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            Sign Up
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>

<main>
  <slot />
</main>

<footer class="bg-slate-900 text-slate-300 mt-12">
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <img src={logo} alt="Scouts Adventures" class="w-8 h-8" />
          <span class="text-white font-bold">Scouts Adventures</span>
        </div>
        <p class="text-sm text-slate-400">
          Navigate your next outdoor adventure with confidence
        </p>
      </div>
      <div>
        <h3 class="text-white font-semibold mb-3">Explore</h3>
        <ul class="space-y-1.5 text-sm">
          <li>
            <a href="/hikes" class="hover:text-sky-400 transition-colors"
              >Hiking Trails</a
            >
          </li>
          <li>
            <a href="/camping" class="hover:text-sky-400 transition-colors"
              >Camping Sites</a
            >
          </li>
          <li>
            <a href="/submit" class="hover:text-sky-400 transition-colors"
              >Submit Adventure</a
            >
          </li>
        </ul>
      </div>
      <div>
        <h3 class="text-white font-semibold mb-3">Account</h3>
        <ul class="space-y-1.5 text-sm">
          {#if user}
            <li>
              <a href="/profile" class="hover:text-sky-400 transition-colors"
                >Profile</a
              >
            </li>
            <li>
              <a href="/favorites" class="hover:text-sky-400 transition-colors"
                >Favorites</a
              >
            </li>
          {:else}
            <li>
              <a href="/login" class="hover:text-sky-400 transition-colors"
                >Login</a
              >
            </li>
            <li>
              <a href="/signup" class="hover:text-sky-400 transition-colors"
                >Sign Up</a
              >
            </li>
          {/if}
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-800 pt-6">
      <p class="text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Scouts Adventures. All rights reserved.
      </p>
    </div>
  </div>
</footer>
