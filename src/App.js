import React, { Component } from 'react';
import uuid from 'uuid';
import lodash from 'lodash';
import logo from './logo.svg';
import './App.css';

const LIMIT = 3;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      activeElementId: '',
      isAddFormVisible: false,
      list: [
        {id: '123', name: '1', surname: 'Dow', patronimic: 'Dogovich'},
        {id: '234', name: '2', surname: 'Forest', patronimic: 'Pigovich'},
        {id: '345', name: '3', surname: 'Pope', patronimic: 'Ratovich'},
        {id: '346', name: '4', surname: 'Monk', patronimic: 'Parrotovich'},
        {id: '347', name: '5', surname: 'Silver', patronimic: 'Catovich'}
      ],
      name: '',
      surname: '',
      patronimic: '',
      error: {
        name: false,
        surname: false,
        patronimic: false
      }
    };

    this.style = {
      list: {cursor: 'pointer', listStyleType: 'none', display: 'inline', margin: '0 5px'},
      line: {marginBottom: '10px'},
      wrapper: {margin: '15px 30px'},
      error: {borderColor: 'red'}
    };
  }

  handleChangeClick = (event) => {
    const {name, surname, patronimic} = this.state.list.find((item) => item.id === event.target.value) || {};
    this.setState({
      activeElementId: event.target.value,
      isAddFormVisible: false,
      name,
      surname,
      patronimic
    });
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value})
  }
  handleSurnameChange = (event) => {
    this.setState({surname: event.target.value})
  }
  handlePatronimicChange = (event) => {
    this.setState({patronimic: event.target.value})
  }

  handleNameFocus = () => this.setState({error: {...this.state.error, name: false}});
  handleSurnameFocus = () => this.setState({error: {...this.state.error, surname: false}});
  handlePatronimicFocus = () => this.setState({error: {...this.state.error, patronimic: false}});

  toggleAddClick = () => {
    this.setState({
      isAddFormVisible: !this.state.isAddFormVisible,
      activeElementId: '',
      name: '',
      surname: '',
      patronimic: ''
    });
  }

  handleNextPage = () => {
    this.setState({
      page: this.state.page + 1
    })
  }

  handlePrevPage = () => {
    this.setState({
      page: this.state.page - 1
    })
  }

  handleSetPage = (page) => {
    this.setState({
      page
    })
  }

  handleValidate = () => {
    const {name, surname, patronimic} = this.state;
    const error = {};
    let count = 0;

    if (!name) { error.name = true; count++; }
    if (!surname) { error.surname = true; count++; }
    if (!patronimic) { error.patronimic = true; count++; }

    if (count) {
      this.setState({
        error
      });
      return false;
    }
    return true;
  }

  handleAddPerson = () => {
    const {name, surname, patronimic} = this.state;
    const id = uuid();
    this.handleValidate() &&
    this.setState({
      list: [...this.state.list, {id, name, surname, patronimic}],
      isAddFormVisible: false,
      name: '',
      surname: '',
      patronimic: ''
    })
  }

  handleChangePerson = () => {
    const newList = this.state.list.map((item) => {
      if (item.id === this.state.activeElementId) {
        item.name = this.state.name;
        item.surname = this.state.surname;
        item.patronimic = this.state.patronimic;
        return item;
      }
      return item;
    })

    this.handleValidate() &&
    this.setState({
      list: newList,
      isAddFormVisible: false,
      activeElementId: '',
      name: '',
      surname: '',
      patronimic: ''
    });
  }

  handleDeleteClick = (event) => {
    const newList = this.state.list.filter((item) => item.id !== event.target.value);
    this.setState({
      list: newList,
      isAddFormVisible: false,
      activeElementId: '',
      name: '',
      surname: '',
      patronimic: ''
    });
  }

  renderEdit(mode) {
    return (
      <React.Fragment>
        <input
          placeholder='Имя'
          onChange={this.handleNameChange}
          value={this.state.name}
          style={this.state.error.name ? this.style.error : {}}
          onFocus={this.handleNameFocus}
        />
        <input
          placeholder='Фамилия'
          onChange={this.handleSurnameChange}
          value={this.state.surname}
          style={this.state.error.surname ? this.style.error : {}}
          onFocus={this.handleSurnameFocus}
        />
        <input
          placeholder='Отчество'
          onChange={this.handlePatronimicChange}
          value={this.state.patronimic}
          style={this.state.error.patronimic ? this.style.error : {}}
          onFocus={this.handlePatronimicFocus}
        />
        <button
          onClick={mode === 'add' ? this.handleAddPerson : this.handleChangePerson}
        >
          {mode === 'edit' ? 'ОК' : 'Добавить'}
        </button>
      </React.Fragment>
    );
  }

  renderOptions = () => {
    const minElem = this.state.page * LIMIT;
    const maxElem = minElem + LIMIT - 1;
    const pages = Math.ceil(this.state.list.length / LIMIT);
    return (
      <React.Fragment>
      {!!pages &&
        <div>
          {
            lodash.times(pages, (i)=> {
              return (<button onClick={() => {this.handleSetPage(i)}}>{i + 1}</button>);
            })
          }
          <button
            onClick={this.handlePrevPage}
            disabled={this.state.page === 0}
            >назад</button>
          <button
            onClick={this.handleNextPage}
            disabled={this.state.page === pages - 1}
            >вперед</button>
        </div>
      }
      <ul>
        {
          this.state.list.map((item, i) => {
            const isEdit = this.state.activeElementId === item.id;

            if (i >= minElem && i <= maxElem) {
              return (
                <div style={this.style.line} key={item.id}>
                  <button
                    key={item.id + 'change'}
                    onClick={this.handleChangeClick}
                    value={item.id}
                  >
                    Изменить
                  </button>
                  <button
                    key={item.id + 'delete'}
                    onClick={this.handleDeleteClick}
                    value={item.id}
                  >
                    Удалить
                  </button>

                  {!isEdit &&
                    <li
                      key={'list' + item.id}
                      style={this.style.list}
                    >
                      {`${item.name} ${item.surname} ${item.patronimic}`}
                    </li>
                  }

                  {isEdit &&
                    this.renderEdit('edit')
                  }

                </div>
              )
            }
            return null;
          })
        }
      </ul>
      </React.Fragment>
    );
  }

  render() {

    return (
      <div style={this.style.wrapper}>
        <button
          onClick={this.toggleAddClick}
        >
          {this.state.isAddFormVisible ? 'Закрыть' : 'Добавить'}
        </button>

        {this.state.isAddFormVisible && this.renderEdit('add')}

        {this.renderOptions()}

      </div>
    );
  }
}



export default App;
