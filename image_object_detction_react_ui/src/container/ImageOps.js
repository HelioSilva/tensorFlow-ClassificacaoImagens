import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';

import {api} from '../utils/Api';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import foto from '../assets/foto1.jpg';
import avatar from  '../assets/avatar.png'; 
import logo from '../assets/logo.fw.png';

export default class ImageOps extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            image_object: null,
            image_object_details: {},
            active_type: null ,
            bloqueado : false ,
            noticias : [],
            value:""
        }

        this.handleChange = this.handleChange.bind(this);

    }

    updateImageObject(e) {
        this.setState({bloqueado:false});

        const file  = e.target.files[0];
        const reader = new FileReader();
        
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.setState({image_object: reader.result, image_object_details: {}, active_type: null});
            this.processImageObject("imagenet");

        };

 

        

  
        
    }

    processImageObject(type) {

        this.setState({active_type: type}, () => {

            if(!this.state.image_object_details[this.state.active_type]) {
                api("detect_image_objects", {
                    type,
                    data: this.state.image_object
                }).then((response) => {

         

                    let limpo = true ;
                    response.data.map((item)=>{
                        if (item.className == 'fire screen, fireguard'){
                            limpo = false;
                        }
                    })

                    if(limpo){

                        this.state.noticias.push({
                            autor:"@usuario",
                            texto : this.state.value,
                            foto: this.state.image_object
                        })

                    }else{
                        this.setState({bloqueado:true})
                    }



                    
                    const filtered_data = response;
                    const image_details = this.state.image_object_details;
        
                    image_details[filtered_data.type] = filtered_data.data;
        
                    this.setState({image_object_details: image_details });
                    this.setState({value:''})
                });
            }
        });

      
        
    }

    handleChange(event) {
        this.setState({value: event.target.value});
      }

    render() {
        // console.log(this.state.image_object_details, " image object details ");
        return (
            <>
            { this.state.bloqueado &&  
            <div style={{
                width:'100%',
                backgroundColor: '#d90b00'
            }}>
                <h5 style={{color:'#fff'}}>Foto postada foi classificada como imprópria!</h5>
            </div> 
            }
            

                    <Container maxWidth="md" >

                    <Grid container spacing={2} style={{
                    backgroundColor: '#f8f8f8'
                    }}>
                        <Grid item xs={12}>
                            <CardContent>
                                <img src={logo} width="300px"/>
                                <h5 >
                                    Rede Social Unsisal
                                </h5>
                            </CardContent>
                        </Grid>




                            {this.state.noticias.map( (item) => {

                                return(

                                    <Grid item xs={12} style={{
                                        display:'flex',
                                        justifyContent:'center',
                                        alignItems:'center',
                                        flexDirection:'column', 
                                    }} >
                                        <div style={{
                                            width:'500px',
                                            display:'flex',
                                            justifyContent:'center',
                                            alignItems:'center',
                                            flexDirection:'column',
                                        }}>
                                    
                                            <div style={{flex:1,textAlign:'start',display:'flex',flexDirection:'row',height:'25px',alignItems:'center'}}>
                                                <img style={{borderRadius:25}} src={avatar} width={20} />
                                    <h5 style={{ marginLeft:'10px',color:'#ccc',width:'300px'}}>{item.autor}</h5>
                                            </div>
                                    
                                    <p style={{fontSize:10,color:'#333'}}>{item.texto}</p>
                                        
                                        
                                            <img style={{borderRadius:10}} src={item.foto} alt="" width="100%"/>
                                    
                                        </div>
                                        
                                        
                                    </Grid>
                                )


                                }  
                            )}
                        





                        
                        <Grid item xs={12}>
                            <Card>

                            <textarea  style={{
                                padding: 15,
                                borderRadius:10,
                                marginTop:20, 
                                width:'80%',
                                minHeight:'100px',
                                borderStyle:'none',
                                backgroundColor: '#ebebeb'
                                }} 
                                placeholder="Digite aqui o que pensa..."
                                value={this.state.value} onChange={this.handleChange}
                                
                            />
                                <CardContent>

                                    

                                    <Button variant="contained"
                                        component='label'
                                        color="primary"
                                        // <-- Just add me!
                                        >
                                           Anexar foto e publicar...
                                        <input accept="image/jpeg" onChange={(e) =>  this.updateImageObject(e)} type="file" style={{ display: 'none' }} />
                                    </Button>
                                    {this.state.active_type && !this.state.image_object_details[this.state.active_type] && 
                                    <Grid item xs={12}>
                                        <CircularProgress
                                            color="secondary"
                                        />
                                    </Grid>
                                }
                                </CardContent>
                            </Card>
                        </Grid>
                        
                    </Grid>
                    </Container>
            
            </>
            
        )
    }
}