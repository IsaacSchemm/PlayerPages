Imports System.Net.Http
Imports System.Text

Public Class Form1
    Private _client As New HttpClient() With {.BaseAddress = New Uri("https://localhost:7175")}

    Private Async Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        sender.Enabled = False
        Try
            Dim response = Await _client.GetAsync($"/api/Pages/{Uri.EscapeDataString(TextBox1.Text)}")
            response.EnsureSuccessStatusCode()
            TextBox2.Text = Await response.Content.ReadAsStringAsync()
        Finally
            sender.Enabled = True
        End Try
    End Sub

    Private Async Sub Button2_Click(sender As Object, e As EventArgs) Handles Button2.Click
        sender.Enabled = False
        Try
            Dim content = New StringContent(TextBox2.Text, Encoding.UTF8, "application/json")
            Dim response = Await _client.PutAsync($"/api/Pages/{Uri.EscapeDataString(TextBox1.Text)}", content)
            response.EnsureSuccessStatusCode()
        Finally
            sender.Enabled = True
        End Try
    End Sub

    Private Async Sub Button3_Click(sender As Object, e As EventArgs) Handles Button3.Click
        sender.Enabled = False
        Try
            Dim response = Await _client.DeleteAsync($"/api/Pages/{Uri.EscapeDataString(TextBox1.Text)}")
            response.EnsureSuccessStatusCode
        Finally
            sender.Enabled = True
        End Try
    End Sub

    Private Async Sub Button4_Click(sender As Object, e As EventArgs) Handles Button4.Click
        sender.Enabled = False
        Try
            Dim response = Await _client.PostAsync($"/api/Pages/{Uri.EscapeDataString(TextBox1.Text)}/show", New StringContent(""))
            response.EnsureSuccessStatusCode()
        Finally
            sender.Enabled = True
        End Try
    End Sub

    Private Async Sub Button5_Click(sender As Object, e As EventArgs) Handles Button5.Click
        sender.Enabled = False
        Try
            Dim response = Await _client.PostAsync($"/api/Pages/{Uri.EscapeDataString(TextBox1.Text)}/hide", New StringContent(""))
            response.EnsureSuccessStatusCode()
        Finally
            sender.Enabled = True
        End Try
    End Sub
End Class
