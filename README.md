# particles-bg

[![NPM](https://img.shields.io/npm/v/particles-bg.svg)](https://www.npmjs.com/package/particles-bg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> React component for particles backgrounds

This project refers to the source code of the [Proton](https://a-jie.github.io/Proton/) official website, I packaged it into a component. You can use it casually in your own projects

### Online demo
* demo1 [https://stackblitz.com/edit/react-a6pm3w](https://stackblitz.com/edit/react-a6pm3w?file=index.js)
* demo2 [https://stackblitz.com/edit/react-bpv9fc](https://stackblitz.com/edit/react-bpv9fc?file=index.js)
* custom [https://stackblitz.com/edit/react-sop6sx](https://stackblitz.com/edit/react-sop6sx?file=index.js)

![](https://github.com/lindelof/particles-bg/blob/master/image/01.jpg?raw=true)

![](https://github.com/lindelof/particles-bg/blob/master/image/02.jpg?raw=true)

![](https://github.com/lindelof/particles-bg/blob/master/image/03.jpg?raw=true)

![](https://github.com/lindelof/particles-bg/blob/master/image/04.jpg?raw=true)

![](https://github.com/lindelof/particles-bg/blob/master/image/05.jpg?raw=true)

![](https://github.com/lindelof/particles-bg/blob/master/image/06.jpg?raw=true)

![](https://github.com/lindelof/particles-bg/blob/master/image/07.jpg?raw=true)

## Install

```bash
npm install --save particles-bg
```

## Usage

```jsx
import React, { Component } from 'react'

import ParticlesBg from 'particles-bg'

class Example extends Component {
  render () {
    return (
      <div>...</div>
      <ParticlesBg type="circle" bg={true} />
    )
  }
}
```

## Parameter Description
```jsx
<ParticlesBg color="#ff0000" num={200} type="circle" bg={true} />
```
#### * type - Is the type of particle animation
Is the type of particle animation, `random` is a random selection. You are also free to customize use `custom`.

```js
"color"
"ball"
"lines"
"thick"
"circle"
"cobweb"
"polygon"
"square"
"tadpole"
"fountain"
"random"
"custom"
```

#### * num - The number of particles emitted each time, generally not set

#### * color - The background color or particle color of the particle scene
Notice: which should be an array under type=`color`

#### * bg - Set to html background
Is set the following properties
```css
position: "absolute",
zIndex: -1,
top: 0,
left: 0
```

## About Custom

![](https://github.com/lindelof/particles-bg/blob/master/image/08.jpg?raw=true)

You can use type="custom" to achieve a higher degree of freedom for the particle background.

```jsx
  let config = {
      num: [4, 7],
      rps: 0.1,
      radius: [5, 40],
      life: [1.5, 3],
      v: [2, 3],
      tha: [-40, 40],
      alpha: [0.6, 0],
      scale: [1, 0.1],
      position: "center", // all or {x:1,y:1,width:100,height:100}
      color: ["random", "#ff0000"],
      cross: "dead", // cross or bround
      random: 15,  // or null
      onParticleUpdate: (ctx, particle) => {
          ctx.beginPath();
          ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.closePath();
      }
    };

    return (
      <div>
        <SignIn />
        <ParticlesBg type="custom" config={config} bg={true} />
      </div>
    )
```

## License

https://opensource.org/licenses/MIT
