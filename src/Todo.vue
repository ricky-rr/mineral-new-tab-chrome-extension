<template>
  <div id="todo">
    <div id="todo-spot">
      <transition name="bounce">
        <input
          v-show="todoSpot != undefined"
          type="checkbox"
          :checked="checked"
          id="todospotcheck"
          v-if="!item"
          @change="deleteFirstItem"
          v-model="checked"
        />
      </transition>
      <transition name="bounce">
        <div class="para" v-if="!item">{{ todoSpot }}</div>
      </transition>
    </div>
    <transition name="fade">
      <div class="todo-container" v-if="!toggle">
        <span class="tip tip-down"></span>
        <div class="menu">
          <h1>Reminders</h1>
          <svg
            id="expand-button"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M24 24H0V0h24v24z" fill="none" opacity=".87" />
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
          </svg>
        </div>
        <div class="list-container">
          <transition-group
            name="bounce"
            mode="out-in"
            tag="ul"
            class="todo-list"
          >
            <li class="list" v-for="(item, i) in existingToDo" :key="item">
              <input type="checkbox" id="check" v-on:click="deleteItem(i)" />{{
                item
              }}
            </li>
          </transition-group>
        </div>
        <input
          type="text"
          class="input"
          placeholder="New Reminder"
          v-model="newTodo"
          @keyup.enter="saveTodo"
        />
      </div>
    </transition>
    <button id="reminders" @click="firstToggle()">Reminders</button>
  </div>
</template>
<script>
export default {
  name: "todo-list",
  data() {
    return {
      checked: false,
      item: true,
      todoSpot: "",
      newTodo: "",
      toggle: true,
      existingToDo: [],
    };
  },
  methods: {
    saveTodo: function() {
      if (this.newTodo !== "") {
        this.existingToDo.push(this.newTodo);
        this.newTodo = "";
        this.todoSpot = this.existingToDo[0];
        this.item = false;
        localStorage.setItem("todos", JSON.stringify(this.existingToDo));
      }
      // value is empty or is default value
    },
    firstToggle: function() {
      this.toggle = !this.toggle;
      localStorage.setItem("reminderToggle", this.toggle);
    },
    deleteFirstItem: function() {
      setTimeout(() => {
        this.item = !this.item;
        setTimeout(() => {
          this.existingToDo.splice(0, 1);
          localStorage.setItem("todos", JSON.stringify(this.existingToDo));
          this.todoSpot = this.existingToDo[0];
          this.checked = false;
          this.item = !this.item;
        }, 150);
      }, 150);
    },
    deleteItem: function(index) {
      this.existingToDo.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(this.existingToDo));
      this.todoSpot = this.existingToDo[0];
    },
  },
  created: function() {
    if (localStorage.getItem("todos")) {
      this.existingToDo = JSON.parse(localStorage.getItem("todos"));
      this.todoSpot = JSON.parse(localStorage.getItem("todos"))[0];
      this.item = false;
    }
    if (localStorage.getItem("reminderToggle") == "false") {
      this.toggle = !this.toggle;
    }
  },
};
</script>

<style>
.bounce-enter-active {
  animation: fade-in 0.5s;
}
.bounce-leave-active {
  animation: fade-out 0.5s;
}
@keyframes fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#expand-button {
  margin-left: 0px;
  margin-top: 18px;
  opacity: 0.5;
  height: 20px;
  width: 20px;
  padding: 0.3em 0.4em;
}

.menu:hover > #expand-button {
  opacity: 1;
  border-radius: 40px;
  box-shadow: inset 0 0 0 45px rgb(145, 145, 145, 0.2);
  padding: 0.3em 0.4em;
}

#expand-button:hover {
  opacity: 1;
  border-radius: 40px;
  box-shadow: inset 0 0 0 45px rgb(145, 145, 145, 0.2);
  padding: 0.3em 0.4em;
}

.menu {
  display: inline-flex;
  height: 50px;
  width: 100%;
}

.menu:hover {
  cursor: pointer;
}

h1 {
  margin-left: 10px;
  font-size: 25px;
  color: black;
}

.list {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: black;
  font-size: 20px;
  list-style-type: none;
  outline: none;
  list-style: none;
  cursor: default;
  border-radius: 3px;
  user-select: none;
  margin-left: -15px;
}

.list-container {
  width: 280px;
  height: 150px;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word;
  border: 3px solid white;
}

.list-container::-webkit-scrollbar {
  width: 8px;
}

.list-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgb(85, 85, 85, 0.35);
}

.list:hover {
  cursor: default;
  background-color: white;
  border-radius: 10px;
}

.list:focus {
  cursor: default;
  background-color: white;
  border-radius: 10px;
}

.todo-container {
  padding-top: 5px;
  padding-right: 5px;
  text-align: initial;
  margin-bottom: 5px;
  position: fixed;
  bottom: 45px;
  right: 30px;
  height: 240px;
  width: 300px;
  background-color: white;
  border-radius: 10px;
  outline: none;
  cursor: default;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
}

.para {
  margin-left: 30px;
  position: relative;
  top: -8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input {
  border-radius: 10px;
  position: absolute;
  border: 4px dotted black;
  left: 10px;
  bottom: 0;
  background-origin: padding-box;
  border-radius: 5px;
  width: 90%;
  height: 20px;
  font-size: 1rem;
  border: 4px solid white;
  outline: none;
}

#todo-spot {
  height: 30px;
  position: fixed;
  font-size: 2.5em;
  top: 290px;
  left: 282px;
  width: 880px;
}

#reminders {
  position: relative;
  font-size: 17px;
  color: rgb(255, 255, 255, 0.85);
  font-family: "Poppins", sans-serif;
  border-radius: 5px;
  height: 50px;
  width: 30px;
  cursor: pointer;
  user-select: none;
  left: 40px;
  padding: 0;
  bottom: 20px;
  border: none;
  background: none;
  transition: color 0.1s ease, text-shadow 0.1s ease;
  opacity: 0.65;
  outline: none;
}

#reminders:active {
  opacity: 1;
}

#todo {
  z-index: 99;
}
.tip-down {
  transform: rotate(45deg);
  bottom: -7px;
  right: 26px;
  border-right-color: transparent;
  border-left-color: transparent;
  border-bottom-color: transparent;
}
.tip {
  width: 0px;
  height: 0px;
  position: absolute;
  background: transparent;
  border: 10px solid white;
}

#check {
  outline: none;
  position: relative;
  top: 3px;
  margin-top: 4px;
  margin-right: 8px;
  width: 1.3em;
  height: 1.3em;
  cursor: pointer;
  background-color: white;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px rgb(167, 167, 167);
  -webkit-appearance: none;
}

#check:checked {
  background-color: rgb(255, 94, 0);
}

#todospotcheck {
  position: absolute;
  outline: none;
  left: 0;
  width: 1.5em;
  height: 1.5em;
  background-color: white;
  border-radius: 50%;
  border: 4px solid white;
  -webkit-appearance: none;
  display: block;
  cursor: pointer;
}

#todospotcheck:checked {
  background-color: rgb(255, 94, 0);
}
</style>
