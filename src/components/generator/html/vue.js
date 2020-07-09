export function vueTemplate (str) {
    return `<template>
      <div>
        ${str}
      </div>
    </template>`
}

export function vueScript (str) {
    return `<script>
      ${str}
    </script>`
}

export function cssStyle (cssStr) {
    return `<style>
      ${cssStr}
    </style>`
}
