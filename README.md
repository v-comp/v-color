# v-color

<img src="public/preview.png" />

## Install

With `npm`: 
```
npm install --save @uscreen-video/v-color
```

Or with `yarn`:

```
yarn add @uscreen-video/v-color
```

## Props

|Name|Type|Default|Description|
|-|-|-|-|
| `value` | `string` | `''` | Color string in `hex`, `rgba` or `hsla` format |
| `withSuggestions` | `boolean` | `true` | Enables colors suggestions which stores in local storage. Picker remembers 7 last colors |

## Events

|Name|Payload|Description|
|-|-|-|
|`input`|`string`|Emits on each color change|
