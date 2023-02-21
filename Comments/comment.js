
//only for learning --> have to use in this app

const NoteState = (props)=>{
    const s1 ={
        "name": "kakashi",
        "role": "copy ninja"
    }
    const [state , setState]= useState(s1);
    const update =()=>{
        setTimeout(() => {
            setState({
                "name": "Madara Uchiha",
                "role": "Ghost of uchiha's"
            })
            
        }, 2000);
    }
  return(
    //having the values which we want to provide to our components 
    <NoteContext.Provider value={{state,update}}>  
        {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;

const About = () => {
    const a = useContext(noteContext)   //we have used the ‘useContext’ method to accept the values provided by note context
    useEffect(()=>{
       a.update();
       // eslint-disable-next-line
    },[])
    return (
      <div>
        This is about {a.state.name} and he is a {a.state.role}
      </div>
    )
  }
  
//   export default About



// import {useHistory} from 'react-router-dom'
// let history = useHistory();
// history.push("/");                  

//alternaate of history is navigate