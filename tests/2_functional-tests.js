const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let id;
  test('every field POST', (done)=>{
    chai.request(server)
       .post('/api/issues/functest')
       .send({
        issue_title: 'Testing',
        issue_text: 'This is testing',
        created_by: 'Prasert',
        assigned_to: 'Ole',
        status_text: 'Ongoing',
       })
       .end((error, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Testing');
        assert.equal(res.body.issue_text, 'This is testing');
        assert.equal(res.body.created_by, 'Prasert');
        assert.equal(res.body.assigned_to, 'Ole');
        assert.equal(res.body.status_text, 'Ongoing');
        id=res.body._id;
        done();
        })
  });

  test('only required field POST', (done)=>{
    chai.request(server)
       .post('/api/issues/functest')
       .send({
        issue_title: 'Testing',
        issue_text: 'This is testing',
        created_by: 'Prasert',
       })
       .end((error, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Testing');
        assert.equal(res.body.issue_text, 'This is testing');
        assert.equal(res.body.created_by, 'Prasert');
        done();
        })
  });

  test('missing required field POST', (done)=>{
    chai.request(server)
       .post('/api/issues/functest')
       .send({
        issue_title: 'Testing',
        issue_text: 'This is testing'
       })
       .end((error, res)=>{
        assert.equal(res.body.error, 'required field(s) missing');
        done();
        })
  });

  test('view issues GET', (done)=>{
    chai.request(server)
       .get('/api/issues/functest')
       .end((error, res)=>{
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], '_id');
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], 'project');
        done();
        })
  });

  test('view issues with one filter GET', (done)=>{
    chai.request(server)
       .get('/api/issues/functest') // /api/issues/functest/?assigned_to=ole
       .query({ assigned_to : 'ole' }) 
       .end((error, res)=>{
            res.body.every((issue)=>{
                assert.equal(issue.assigned_to, 'ole')
            });
        done();
        })
  });

  test('view issues with multiple filter GET', (done)=>{
    chai.request(server)
       .get('/api/issues/functest') // /api/issues/functest/?assigned_to=ole&open=true
       .query({ assigned_to : 'ole', open: 'true' }) 
       .end((error, res)=>{
            res.body.every((issue)=>{
                assert.equal(issue.assigned_to, 'ole')
                assert.equal(issue.open, true)
            });
        done();
        })
  });

  test('update one field PUT', (done)=>{
    chai.request(server)
       .put('/api/issues/functest')
       .send({
        _id: id,
        issue_text: 'This is put testing'
       })
       .end((error, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body._id, id);
        assert.equal(res.body.result, 'successfully updated');
        done();
        })
  });

  test('update multiple field PUT', (done)=>{
    chai.request(server)
       .put('/api/issues/functest')
       .send({
        _id: id,
        issue_text: 'This is put testing',
        created_by: 'kkk'
       })
       .end((error, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body._id, id);
        assert.equal(res.body.result, 'successfully updated');
        done();
        })
  });

  test('update muissing _id field PUT', (done)=>{
    chai.request(server)
       .put('/api/issues/functest')
       .send({
        _id: ''
       })
       .end((error, res)=>{
        assert.equal(res.body.error, 'missing _id');
        done();
        })
  });

  test('no field to update PUT', (done)=>{
    chai.request(server)
       .put('/api/issues/functest')
       .send({
        _id: id
       })
       .end((error, res)=>{
        assert.equal(res.body._id, id);
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
        })
  });

  test('update with invalid id PUT', (done)=>{
    chai.request(server)
       .put('/api/issues/functest')
       .send({
        _id: '12345',
        issue_text: 'This is put testing',
       })
       .end((error, res)=>{
        assert.equal(res.body._id, '12345');
        assert.equal(res.body.error, 'could not update');
        done();
        })
  });

  test('delete issue', (done)=>{
    chai.request(server)
       .delete('/api/issues/functest')
       .send({
        _id: id,
       })
       .end((error, res)=>{
        assert.equal(res.body._id, id);
        assert.equal(res.body.result, 'successfully deleted');
        done();
        })
  });

  test('delete invalid id', (done)=>{
    chai.request(server)
       .delete('/api/issues/functest')
       .send({
        _id: '12345',
       })
       .end((error, res)=>{
        assert.equal(res.body._id, '12345');
        assert.equal(res.body.error, 'could not delete');
        done();
        })
  });

  test('delete missing id', (done)=>{
    chai.request(server)
       .delete('/api/issues/functest')
       .send({
        _id: '',
       })
       .end((error, res)=>{
        assert.equal(res.body.error, 'missing _id');
        done();
        })
  });
});
