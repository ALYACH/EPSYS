import * as React from 'react'
import Styles from './index.module.scss'
import ParticleSystem from '@/THREE'
import { useEffect, useRef,useState } from 'react'
import AtmosphereParticle from '@/THREE/atmosphere'
import { ParticleModelProps } from '@/declare/THREE'
import Tween from '@tweenjs/tween.js'
import GetFlatGeometry from '@/utils/GetFlatGeometry'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import VerticesDuplicateRemove from '@/utils/VerticesDuplicateRemove'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import LoadingAnimation from './LoadingAnimation';
function IndexPage() {
  const [progress, setProgress] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const wrapper = useRef<HTMLDivElement | null>(null)
  // let MainParticle: ParticleSystem | null = null
  const MainParticle=useRef<ParticleSystem | null>(null)
  let hasInit = false
  let lastname=""
  let time_change:any
  let time_txt:any
  const TurnBasicNum = { firefly: 0.002 }
  const al = 1500
  const [current,setCurrent] = React.useState("")
  const [txtbox,setTxtbox] = React.useState("righttxt")
  const [txtConObj,setTxtConObj] = React.useState({"txt1":"","txt2":"","txt3":""})
  // const [txtcontent2,setTxtcontent2] = React.useState("")
  // const [txtcontent3,setTxtcontent3] = React.useState("")
  interface TextObj {
    [key: string]: string[]
  }
  const txtobj:TextObj={
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
      modelId:0,
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
      modelId:1,
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
      modelId:2,
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
      modelId:3,
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
    sessionStorage.setItem("modelId",val.modelId.toString())
      setCurrent(name)
    setTxtbox("")
    setTxtConObj({"txt1":"","txt2":"","txt3":""})
    
    MainParticle.current?.ChangeModel(name)
    console.log("MainParticle",MainParticle.current)
    clearTimeout(time_txt) 
    time_txt=setTimeout(function() {
      if(txtarr.indexOf(name)%2==0){
        setTxtbox("lefttxt")
      }else{
        setTxtbox("righttxt")
      }
      setTxtConObj({"txt1":txtobj[name][0],"txt2":txtobj[name][1],"txt3":txtobj[name][2]})
  }, 3000) // 延迟3秒
    
  }
  // // @ts-expect-error
  // window.changeModel = (name: string) => {
  //   if (MainParticle.current != null) {
      
  //     MainParticle.current.ChangeModel(name)
  //   }
  // }
  window.onclick = function(event) {
    let id=sessionStorage.getItem("modelId"),modelId;
    console.log("onclick Models",Models);
     console.log("onclick modelId",id);
    if(id==null||Number(id)==Models.length-1){
      modelId=0;
    }else{
      modelId=Number(id)+1;
    }
     change(Models[modelId]);
     
  }
  
  useEffect(() => {
    console.log("useEffect11",MainParticle)
    console.log("wrapper",wrapper)
    // if (!hasInit) {
    //   hasInit = true
    let loadProgress=0
      if ((MainParticle.current == null) && wrapper.current != null) {
          MainParticle.current = new ParticleSystem({
            CanvasWrapper: wrapper.current,
            Models,
            addons: [Atomsphere1, Atomsphere2, Atomsphere3],
            onModelsFinishedLoad: (point) => {
              // change(Models[0])
              // MainParticle.current?.ListenMouseMove()
              // console.log("onModelsFinishedLoad")
              // 模拟模型加载进度
               loadProgress = 90;
              const interval = setInterval(() => {
                loadProgress += 5;
                console.log("loadProgress",loadProgress)
                setProgress(loadProgress);
                if (loadProgress >= 100) {
                  clearInterval(interval);
                  setModelLoaded(true);
                  change(Models[0])
                  MainParticle.current?.ListenMouseMove()
                }
              }, 100);
            }
          })
      }
  });
//   (()=>{
//     if(document.all){
//     MainParticle.current?.ChangeModel("数据")
//     }
//  })();
 
  return (
    <div className={Styles.index_page}>
      <div className={Styles.top}>
        {/* <img src="../../src/assets/images/logo.png" alt="" /> */}
        <div className={Styles.title}>个人作品</div>
      </div>
      
      <div className={Styles.canvas_wrapper} ref={wrapper}></div>
      <ul className={Styles.list}>
        {
          Models.map((val) => {
            return (
              <li key={val.name} className={current==val.name ? Styles.active : ''} onClick={(event) => {event.preventDefault();event.stopPropagation();change(val)}}>
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
          <p className={Styles.pstyle}>{txtConObj.txt1}</p>
          <p className={Styles.pstyle}>{txtConObj.txt2}</p>
          <p className={Styles.pstyle}>{txtConObj.txt3}</p>
        </div>
        {/* <div className={Styles.txt1}> </div> */}
      </div>
      <a className={Styles.beian} href="https://beian.miit.gov.cn/" target="_blank">皖ICP备2021011752号-1</a>
      <LoadingAnimation show={progress < 100} progress={progress} />
    </div>
  )
}

export default IndexPage
