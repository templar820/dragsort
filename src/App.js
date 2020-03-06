import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
//count = 10
const getItems = (count, offset = 0) =>
    Array.from({length:count}, (v, k) =>k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;



let prev
const getItemStyle = (isDragging, draggableStyle) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  }
}

const getListStyle = (provided, snapshot) => {
  console.log('1: ', provided)
  console.log('2: ', snapshot)
  return {
    background: true ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
  }

};





export default class App extends Component {

    constructor(props){
      super(props)
      this.state = {
        mapStructure : [
          {
            id: 'A',
            data: getItems(5)
          },
          {
            id: 'B',
            data: getItems(5,5)
          },
          {
            id: 'C',
            data: getItems(5,10)
          },
          {
            id: 'D',
            data: getItems(5,15)
          },
        ],
        rules :[
          ['A', 'B'],
          ['C', 'D'],
        ]
      };
    }


    getStructure = (id) =>{
      return this.state.mapStructure.find(el => el.id == id)
    } 

    CheckRules(source , target){
      let flag = false
      this.state.rules.forEach( (element, index) => {
        if(element.find( item => item == source) && element.find( item => item == target)) flag= true;
      })
      return flag
    }

    onDragEnd = result => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId){
            let mapStructure = this.state.mapStructure
            let structure = this.getStructure(source.droppableId)
            let items = reorder(
                structure.data,
                source.index,
                destination.index
            );
            mapStructure.forEach(el => {
              if(el.id == structure.id){
                el.data = items
              }
            });
            this.setState(mapStructure);

        }else if (this.CheckRules(source.droppableId, destination.droppableId)){
            let mapStructure = this.state.mapStructure
            let sourceStructure = this.getStructure(source.droppableId)
            let targetStructure = this.getStructure(destination.droppableId)
  
            let result = move(
                sourceStructure.data,
                targetStructure.data,
                source,
                destination
            );

            mapStructure.forEach(el => {
              if(el.id == sourceStructure.id){
                el.data = result[sourceStructure.id]
              }
              if(el.id == targetStructure.id){
                el.data = result[targetStructure.id]
              }
            });

            this.setState({
              mapStructure
            });
        }
    };

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
              {this.state.mapStructure.map((el, index) => {
                return(
                  <Droppable droppableId={el.id} key = {index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot, provided)}>
                            {el.data.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                  </Droppable>
                )
              })}
            </DragDropContext>
        );
    }
}






// export default class App extends React.Component {
//   render () {
//     return (
//       <div className='container' ref={this.dragulaDecorator}>
//         <div>Swap me around</div>
//         <div>Swap her around</div>
//         <div>Swap him around</div>
//         <div>Swap them around</div>
//         <div>Swap us around</div>
//         <div>Swap things around</div>
//         <div>Swap everything around</div>
//       </div>
//     )

//   }

//   dragulaDecorator = (componentBackingInstance) => {
//     if (componentBackingInstance) {
//       let options = { };
//       Dragula([componentBackingInstance], options);
//     }
//   }
// }



//React.render(<App />, document.getElementById('examples'));





//export default class App extends React.Component{
//   constructor(props){
//     super(props)
//     this.ref = React.createRef('123123123213');

//   }

//   componentDidMount() {
//     dragula([document.getElementById('left-events'), document.getElementById('right-events')])
      
//   }


//   render() {
//     return(
//       <div className = 'examples'>
//         <div class='parent'>
//           <label for='hy'>There are plenty of events along the lifetime of a drag event. Check out <a href='https://github.com/bevacqua/dragula#drakeon-events'>all of them</a> in the docs!</label>
//           <div class='wrapper'>
//             <div id='left-events' class='container'>
//               <div>As soon as you start dragging an element, a <code>drag</code> event is fired</div>
//               <div>Whenever an element is cloned because <code>copy: true</code>, a <code>cloned</code> event fires</div>
//               <div>The <code>shadow</code> event fires whenever the placeholder showing where an element would be dropped is moved to a different container or position</div>
//               <div>A <code>drop</code> event is fired whenever an element is dropped anywhere other than its origin <em>(where it was initially dragged from)</em></div>
//             </div>
//             <div id='right-events' class='container'>
//               <div>If the element gets removed from the DOM as a result of dropping outside of any containers, a <code>remove</code> event gets fired</div>
//               <div>A <code>cancel</code> event is fired when an element would be dropped onto an invalid target, but retains its original placement instead</div>
//               <div>The <code>over</code> event fires when you drag something over a container, and <code>out</code> fires when you drag it away from the container</div>
//               <div>Lastly, a <code>dragend</code> event is fired whenever a drag operation ends, regardless of whether it ends in a cancellation, removal, or drop</div>
//             </div>  
//           </div>
//         </div>
//       </div>
//     ) 
//   }
// }