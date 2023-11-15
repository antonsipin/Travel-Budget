const React = require('react')

const Loader = () => {
  return (
    <div style={{
      margin: "30px 0 100px 0"
      }}>
      <div style={{
        color: "rgb(0, 176, 159)", 
        fontSize: "2rem", 
        fontWeight: "700",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "50px 0 20px 0"
        }}>
          Sending, please wait...
        </div>

        <div class="progress">
          <div class="indeterminate" style={{
            margin: "20px 0 50px 0"
          }}
        />
      </div>
    </div>
    
  )
}

module.exports = Loader