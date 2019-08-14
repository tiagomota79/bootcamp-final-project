import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const AddItemWindow = styled.div`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddItemCard = styled.div`
  background-color: #1b98e0;
  width: 40%;
  padding: 5%;
  box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.25);
  text-align: center;
  font-weight: 600;
  font-size: larger;
  max-height: 70vh;
`;

const AddItemForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h2`
  font-size: xx-large;
  margin-top: 0;
  margin-bottom: 2%;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: none;
  padding: 1%;
  margin: 2%;
  text-align: center;
  align-self: center;
`;

const IMDb = styled.a`
  color: white;
  text-decoration: none;
  font-size: small;
  font-weight: 300;
`;

const PicButton = styled.input`
  align-self: center;
  padding: 3%;
`;

const FormatBox = styled.div`
  height: 40px;
  padding: 2%;
`;

const formatLabel = css`
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
  width: 75px;
  height: 100%;
  margin-right: 5%;
  margin-left: 5%;
  transition: all 0.25s ease-in-out;
`;

const formatInput = css`
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
`;

const VHSLabel = styled.label`
  background-image: url(/imgs/VHS_logo_white.svg);
  ${formatLabel}

  :hover {
    background-image: url(/imgs/VHS_logo_black.svg);
    opacity: 0.5;
  }
`;

const FormatInputVHS = styled.input`
  ${formatInput}

  :checked + ${VHSLabel} {
    background-image: url(/imgs/VHS_logo_black.svg);
  }
`;

const DVDLabel = styled.label`
  background-image: url(/imgs/DVD_logo_white.svg);
  ${formatLabel}

  :hover {
    background-image: url(/imgs/DVD_logo_black.svg);
    opacity: 0.5;
  }
`;

const FormatInputDVD = styled.input`
  ${formatInput}

  :checked + ${DVDLabel} {
    background-image: url(/imgs/DVD_logo_black.svg);
  }
`;

const BDLabel = styled.label`
  background-image: url(/imgs/BD_logo_white.svg);
  ${formatLabel}

  :hover {
    background-image: url(/imgs/BD_logo_black.svg);
    opacity: 0.5;
  }
`;

const FormatInputBD = styled.input`
  ${formatInput}

  :checked + ${BDLabel} {
    background-image: url(/imgs/BD_logo_black.svg);
  }
`;

const Description = styled.textarea`
  width: 100%;
  border-radius: 3px;
  border: none;
  padding: 1%;
  margin: 2%;
  text-align: center;
  align-self: center;
`;

const Submit = styled.input`
  margin: 2%;
  width: 100%;
  border: none;
  border-radius: 3px;
  height: 30px;
  font-size: large;
  align-self: center;

  :hover {
    border: solid 1px;
    border-color: #fcfdff;
    border-radius: 3px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  }
`;

class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      year: 0,
      price: 0,
      imgPath: null,
      format: '',
      description: '',
    };
  }
  handleChange = (evt, key) => {
    this.setState({ [key]: evt.target.value });
  };
  handlePicInput = evt => {
    console.log(evt.target.value);
    this.setState({ imgPath: evt.target.value });
  };
  handleSubmit = async evt => {
    evt.preventDefault();
    const formElem = document.querySelector('#addItemForm');
    let form = new FormData(formElem);
    console.log('AddItem form', form);
    console.log('AddItem state in HandleSubmit', this.state);
    const response = await fetch('/additem', {
      method: 'POST',
      body: form,
    });
    const json = await response.json();
    this.props.dispatch({ type: 'ADD_ITEM', payload: json.itemToAdd });
    this.props.history.push('/');
  };
  render() {
    console.log('AddItem state in render', this.state);
    const searchIMDb = `https://www.imdb.com/find?ref_=nv_sr_fn&q=${
      this.state.name
    }&s=all`;
    return (
      <AddItemWindow>
        <AddItemCard>
          <CardTitle>Sell a movie</CardTitle>
          <AddItemForm id='addItemForm' onSubmit={this.handleSubmit}>
            Title
            <Input
              type='text'
              name='name'
              onChange={evt => this.handleChange(evt, 'name')}
              placeholder='Movie Title'
              required
            />
            Year
            <IMDb
              href={!this.state.name ? 'https://www.imdb.com/' : searchIMDb}
              target='_blank'
            >
              Not sure? Search IMDb.
            </IMDb>
            <Input
              type='number'
              name='year'
              onChange={evt => this.handleChange(evt, 'year')}
              placeholder='Movie year'
              min='1900'
              required
            />
            Price
            <Input
              type='number'
              name='price'
              onChange={evt => this.handleChange(evt, 'price')}
              placeholder='Your price'
              min='0'
              required
            />
            Cover Photo
            <PicButton
              type='file'
              name='imgPath'
              accept='image/*'
              onChange={this.handlePicInput}
            />
            Format
            <FormatBox className='formatBox'>
              <FormatInputVHS
                id='VHS'
                type='radio'
                name='format'
                onChange={evt => this.handleChange(evt, 'format')}
                value='VHS'
                checked={this.state.format === 'VHS'}
                required
              />
              <VHSLabel className='selector VHS' htmlFor='VHS' />
              <FormatInputDVD
                id='DVD'
                type='radio'
                name='format'
                onChange={evt => this.handleChange(evt, 'format')}
                value='DVD'
                checked={this.state.format === 'DVD'}
                required
              />
              <DVDLabel className='selector DVD' htmlFor='DVD' />
              <FormatInputBD
                id='BluRay'
                type='radio'
                name='format'
                onChange={evt => this.handleChange(evt, 'format')}
                value='Blu Ray'
                checked={this.state.format === 'Blu Ray'}
                required
              />
              <BDLabel className='selector BluRay' htmlFor='BluRay' />
            </FormatBox>
            Description
            <Description
              name='description'
              onChange={evt => this.handleChange(evt, 'description')}
              required
            />
            <Submit type='submit' value='Submit' />
          </AddItemForm>
        </AddItemCard>
      </AddItemWindow>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.loggedIn,
  };
};

export default withRouter(connect(mapStateToProps)(AddItem));
