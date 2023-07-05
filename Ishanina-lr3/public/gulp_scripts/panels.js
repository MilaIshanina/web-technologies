"use strict";

$(document).ready(function () {
  $('#add_panel').hide();
});

function add_panel() {
  $('#add_panel').toggle();
  $('input[name="name"]').val("");
  $('input[name="author"]').val("");
  $('input[name="price"]').val("100");
  $('input[name="max"]').val("10");
  $('input[name="min"]').val("10");
  $('input[name="balance"]').val("100");
}

function edit_panel(name, author, price, min, max, id) {
  $('#edit_panel').show(300);
  $('#edit_form').attr('action', 'card/edit/' + id);
  $('input[name="ename"]').val(name);
  $('input[name="eauthor"]').val(author);
  $('input[name="eprice"]').val(price);
  $('input[name="emax"]').val(max);
  $('input[name="emin"]').val(min);
}

function edit_panel_close() {
  $('#edit_panel').toggle(300);
}

function edit_user_panel(nickname, name, surname, balance, id, avatar) {
  $('#edit_panel').show(300);
  $('#edit_form').attr('action', 'user/edit/' + id);
  $('input[name="enickname"]').val(nickname);
  $('input[name="ename"]').val(name);
  $('input[name="esurname"]').val(surname);
  $('input[name="eavatar"]').val(avatar);
  $('input[name="ebalance"]').val(balance);
}