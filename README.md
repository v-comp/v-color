# v-color

> Simple color picker for `vue@2`

<br>
<br>
<br>
<div align="center">
  <img src="public/preview.png" width="65%" />
</div>
<br>

## Install

With `npm`: 
```
npm install --save @uscreen-video/v-color
```

Or with `yarn`:

```
yarn add @uscreen-video/v-color
```

## Components

### `VColorPicker`

This is the main component, which just represents color picker as is.

**Props**

---

**`value`** – Color string in `hex`, `rgba` or `hsla` format

_type_: `string`

_default value_: `''`

---

**`withSuggestions`** – Enables colors suggestions which stores in local storage. Picker remembers 7 last colors

_type_: `boolean`

_default value_: `true`

**Events**

---

**`input`** – Emits on each color change

### `VColorPopover`

It includes `VColorPicker`, but wrapped into popover component with control button and
current color preview. Use it when you need to save visual space.

**Props**

---

**`value`** – Color string in `hex`, `rgba` or `hsla` format

_type_: `string`

_default value_: `''`

---

**`withSuggestions`** – Enables colors suggestions which stores in local storage. Picker remembers 7 last colors

_type_: `boolean`

_default value_: `true`

---

**`position`** – Popover's position after appearing

_type_: `string`

_possible values_: `bottom|left|top|right`

_default value_: `bottom`

**Events**

---

**`input`** – Emits on each color change
