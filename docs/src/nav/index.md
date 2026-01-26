---
layout: doc
layoutClass: m-nav-layout
sidebar: false
prev: false
next: false
---

<style src="@theme/styles/nav.scss"></style>

<script setup>
import { NAV_DATA } from '@theme/untils/data'
</script>


# 我的导航

<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>