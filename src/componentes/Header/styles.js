import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
}));

// export const Container = styled.header`
//    height: 70px;
//    background-color: #323540;
//    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.2);
//    text-align: center;
//    display: flex;
//    justify-content: space-between;
//    align-items: center;
//    color: #B2D9A0;
//    width: 100%;
//    h1{
//        margin-left: 20px;
//        font-size: 1.2rem;
//    }
//    ul{
//        margin-right: 30px;
//        display: flex;
//        justify-content: space-between; 
//        align-items: center;
//    }
//    li{
//        order: 1;
//        display: flex;
//        flex-direction: column;
//    }
//    a{
//     order: 0;   
//     text-decoration: none;
//     color: #B2D9A0;
//     font-size: 1rem; 
//     padding: 2.4rem;
//     transition: all 250ms linear 0s;
//     cursor: grabbing;
//    }

//    @media (max-width: 1200px){
//     width: 100vw;
//     nav{
//         display: none;
//     }

//     .one,
//     .two,
//     .three{
//         height: 5px;
//         width: 100%;
//         background-color: #FFF;
//         margin: 5px auto;
//         border-radius: 5px;

//         transition-duration: 0.3s;
//     }

//     .menu-toogle{
//         height: 35px;
//         width: 35px;
//         margin-right: 10px;
//     }

//     .menu-section.on{
//         position: absolute;
//         top: 0;
//         left: 0;
//         background-color: #323540;
//         height: 100vh;
//         width: 100vw;
//         z-index: 10;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//     }

//     .menu-section.on nav{
//         display: block;
//     }

//     .menu-section.on .menu-toogle{
//         position: absolute;
//         right: 5px;
//         top: 15px;
//     }

//     .menu-section.on .menu-toogle .one{
//         transform: rotate(45deg) translate(7px, 7px)
//     }

//     .menu-section.on .menu-toogle .two{
//         opacity: 0;
//     }

//     .menu-section.on .menu-toogle .three{
//         transform: rotate(-45deg) translate(8px, -8px)
//     }

//     .menu-section.on nav ul{
//         text-align: center;
//         display: block;
//     }

//     .menu-section.on nav ul{
//         transition-duration: 0.5s;
//         font-size: 1.5rem;
//         line-height: 1rem;
//         display: block;
//     }    
//   } 
// `;
