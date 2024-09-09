import * as React from 'react'
import Styles from './index.module.scss'
import ParticleSystem from '@/THREE'
import { useEffect, useRef } from 'react'
import AtmosphereParticle from '@/THREE/atmosphere'
import { ParticleModelProps } from '@/declare/THREE'
import Tween from '@tweenjs/tween.js'
import GetFlatGeometry from '@/utils/GetFlatGeometry'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import VerticesDuplicateRemove from '@/utils/VerticesDuplicateRemove'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
function IndexPage() {
  const wrapper = useRef<HTMLDivElement | null>(null)
  // let MainParticle: ParticleSystem | null = null
  const MainParticle=useRef<ParticleSystem | null>(null)
  let hasInit = false
  const TurnBasicNum = { firefly: 0.002 }
  const al = 1500
  const [current,setCurrent] = React.useState("")
  const [txtbox,setTxtbox] = React.useState("righttxt")
  const [txtcontent1,setTxtcontent1] = React.useState("")
  const [txtcontent2,setTxtcontent2] = React.useState("")
  const [txtcontent3,setTxtcontent3] = React.useState("")
  const txtobj={
    "数据":["实时数据收集处理","精准决策支持","信息共享协同"],
    "范围":["跨国团队协作紧密","多元文化融合创新","全球化视野决策高效"],//"全球视野","多元文化","高效决策"
    "安全":["数据加密技术先进","多重备份防数据丢失","访问控制与审计严格"],
    "稳定":["系统稳定运行高效","功能完善满足需求","用户认可依赖度高"]
  }
  const txtarr=["数据","安全","稳定","范围"]

  const tween2 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)
  const tween1 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)

  const Atomsphere1 = new AtmosphereParticle({
    longestDistance: al,
    particleSum: 500,
    renderUpdate: (Point) => {
      Point.rotation.x -= TurnBasicNum.firefly
    },
    callback: (Point) => {
      Point.position.z = -1 * al
    },
    onChangeModel: () => {
      tween2.stop()
      tween1.stop().to({ firefly: 0.04 }, 1500).chain(tween2)
      tween2.to({ firefly: 0.002 }, 1500)
      tween1.start()
    }
  })
  const Atomsphere2 = new AtmosphereParticle({
    longestDistance: al,
    particleSum: 500,
    renderUpdate: (Point) => {
      Point.rotation.y += TurnBasicNum.firefly
    },
    callback: (Point) => {
      Point.position.y = -0.2 * al
      Point.position.z = -1 * al
    }
  })
  const Atomsphere3 = new AtmosphereParticle({
    longestDistance: al,
    particleSum: 500,
    renderUpdate: (Point) => {
      Point.rotation.z += TurnBasicNum.firefly / 2
    },
    callback: (Point) => {
      Point.position.z = -1.2 * al
    }
  })

  const scaleNum = 400
  let Q = 0
  const Models: ParticleModelProps[] = [
    {
      name: '数据',
      path: new URL('../../THREE/models/examples/transmission.obj', import.meta.url).href,
      isCurrentModel:false,
      onLoadComplete(Geometry) {
        const s = 500
        Geometry.scale(s, s, s)
        Geometry.translate(400, -600, 0)
      },
      onEnterStart(PointGeometry) {
          // setCurrent(this.CurrentUseModelName)
        console.log('cube enter start',PointGeometry)
      }
    },
    {
      name: '安全',
      //path: new URL('../../THREE/models/examples/ball.obj', import.meta.url).href,
      path: new URL('../../THREE/models/examples/safe.obj', import.meta.url).href,
      isCurrentModel:false,
      onLoadComplete(Geometry) {
        const s = 1600
        Geometry.scale(s, s, s)
        Geometry.translate(-400, -1400, -200)
      },
      onEnterStart(PointGeometry) {
        //  setCurrent(this.CurrentUseModelName)
        // console.log('ball enter end',this)
      }
    },
    {
      name: '稳定',
      geometry: GetFlatGeometry(),
      isCurrentModel:false,
      onAnimationFrameUpdate(PerfromPoint, TweenList, Geometry) {
        const p = PerfromPoint.geometry.getAttribute('position')
        TweenList.forEach((val, i) => {
          if (val.isPlaying === false) {
            p.setY(i, Math.sin((i + 1 + Q) * 0.3) * 50 + Math.sin((i + Q) * 0.5) * 50 - 500)
          }
        })
        Q += 0.08
        return true
      },     
      onEnterStart(PointGeometry) {
          //  setCurrent(this.CurrentUseModelName)
          // console.log('wave enter start',this)
        }
    },
    {
      name: '范围',
      path: new URL('../../THREE/models/examples/w1.obj', import.meta.url).href,
      isCurrentModel:false,
      onLoadComplete(Geometry) {
        // Geometry.scale(scaleNum, scaleNum, scaleNum)
        // Geometry.translate(600, 100, -100)
        const s = 2000
        Geometry.scale(s, s, s)
        Geometry.translate(-400, -2500, -200)
      },     
      onEnterStart(PointGeometry) {
        console.log('person enter start',this)
      }
    }
  ]
  let name="";
  function change(val: ParticleModelProps) {
    let name=val.name
    setCurrent(name)
    setTxtbox("")
    setTxtcontent1("")
    setTxtcontent2("")
    setTxtcontent3("")
    MainParticle.current?.ChangeModel(name)
    console.log("MainParticle",MainParticle.current)
    
    setTimeout(function() {
      if(txtarr.indexOf(name)%2==0){
        setTxtbox("lefttxt")
      }else{
        setTxtbox("righttxt")
      }
      setTxtcontent1(txtobj[name][0])
      setTxtcontent2(txtobj[name][1])
      setTxtcontent3(txtobj[name][2])
  }, 3000); // 延迟3秒
    
  }
  // @ts-expect-error
  window.changeModel = (name: string) => {
    if (MainParticle.current != null) {
      
      MainParticle.current.ChangeModel(name)
    }
  }

  useEffect(() => {
    console.log("useEffect",MainParticle)
    console.log("wrapper",wrapper)
    // if (!hasInit) {
    //   hasInit = true
      if ((MainParticle.current == null) && wrapper.current != null) {
          MainParticle.current = new ParticleSystem({
            CanvasWrapper: wrapper.current,
            Models,
            addons: [Atomsphere1, Atomsphere2, Atomsphere3],
            onModelsFinishedLoad: (point) => {
              MainParticle.current?.ListenMouseMove()
            }
          })
      }
    // if ((MainParticle == null) && wrapper.current != null) {
    //   MainParticle = new ParticleSystem({
    //     CanvasWrapper: wrapper.current,
    //     Models,
    //     addons: [Atomsphere1, Atomsphere2, Atomsphere3],
    //     onModelsFinishedLoad: (point) => {
    //       MainParticle?.ListenMouseMove()
    //     }
    //   })
      // let current = MainParticle.CurrentUseModelName?MainParticle.CurrentUseModelName: 'wave';
      // setCurrent(current)
    // }
  })

  return (
    <div className={Styles.index_page}>
      <div className={Styles.top}>
        {/* <img src="../../src/assets/images/logo.png" alt="" /> */}
        <div className={Styles.title}>FOXCONN</div>
      </div>
      
      <div className={Styles.canvas_wrapper} ref={wrapper}></div>
      <ul className={Styles.list}>
        {
          Models.map((val) => {
            return (
              <li key={val.name} className={current==val.name ? Styles.active : ''} onClick={() => change(val)}>
                <i className="nav_spot"></i>
                <span>{val.name}</span>
              </li>
            )
          })
        }
      </ul>
      {/* <ul className={Styles.function_list}>
        <li onClick={() => MainParticle?.ListenMouseMove()}>ListenMouseMove</li>
        <li onClick={() => MainParticle?.StopListenMouseMove()}>StopListenMouseMove</li>
        <li onClick={() => MainParticle?.AlignCameraCenter()}>AlignCameraCenter</li>
        <li onClick={() => MainParticle?.AlignCameraCenter(true)}>AlignCameraCenter(immediately)</li>
      </ul> */}
      <div className={Styles.thtableCell} style={{height: 959}}>
        <div className={`Styles.box ${txtbox=="lefttxt" ? Styles.lefttxt : Styles.righttxt}`}>
          <p className={Styles.pstyle}>{txtcontent1}</p>
          <p className={Styles.pstyle}>{txtcontent2}</p>
          <p className={Styles.pstyle}>{txtcontent3}</p>
        </div>
        {/* <div className={Styles.txt1}> </div> */}
      </div>
    </div>
  )
}

export default IndexPage
