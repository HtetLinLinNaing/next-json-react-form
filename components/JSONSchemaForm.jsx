import React from 'react';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';
import { Box } from '@mui/material';

function extractFilledValues(schema, data) {
  const filledValues = {};

  function traverseSchema(s, d, path = '') {
    if (s.type === 'object' && s.properties) {
      Object.keys(s.properties).forEach((key) => {
        const newPath = path ? `${path}.${key}` : key;

        if (d[key] !== undefined) {
          if (s.properties[key].type === 'object') {
            traverseSchema(s.properties[key], d[key], newPath);
          } else if (s.properties[key].type === 'array') {
            if (Array.isArray(d[key])) {
              d[key].forEach((item, index) => {
                const itemPath = `${newPath}[${index}]`;
                traverseSchema(s.properties[key].items, item, itemPath);
              });
            }
          } else if (d[key] !== null && d[key] !== '') {
            filledValues[newPath] = d[key];
          }
        }
      });
    }
  }

  traverseSchema(schema, data);

  return filledValues;
}


const JSONSchemaForm = () => {

  const schema = require("../jsonFiles/schemas.json")

  function handleSubmit({ formData }) {
    // console.log(filteredData.FrameObjects[0].Appearance.AgeGroupAttributes.PersonAgeGroup)
    console.log(formData);

    const filledValues = extractFilledValues(schema, formData);
    console.log('Filled Values:', filledValues);
  }
  
  return (
    <Box
    display="flex"
    justifyContent="center"
    minHeight="100vh">

     <Box width={500} height={200}>
     <h1>JSON Schema Form</h1>
     <Form schema={schema} validator={validator} onSubmit={handleSubmit}/>
     </Box>
    </Box>
  )
}

export default JSONSchemaForm;
