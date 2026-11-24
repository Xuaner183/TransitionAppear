<template>
  <main>
    <h1>Transition appear / production hydration</h1>
    <p>Expected: all three messages below become visible.</p>

    <section id="static-case">
      <h2>1. Static child (reported failure)</h2>
      <Transition name="fade" appear>
        <p id="static-message">Static child inside Transition appear</p>
      </Transition>
    </section>

    <section id="conditional-case">
      <h2>2. Same child with v-if="true" (control)</h2>
      <Transition name="fade" appear>
        <p v-if="true" id="conditional-message">Conditional child inside Transition appear</p>
      </Transition>
    </section>

    <section>
      <h2>3. No Transition (control)</h2>
      <p id="plain-message">Plain static child</p>
    </section>
  </main>
</template>

<style>
main {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 24px;
  font-family: sans-serif;
  line-height: 1.6;
}

section {
  margin: 24px 0;
  padding: 16px;
  border: 1px solid #aaa;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
