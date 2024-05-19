Imports System.Net.Http
Imports System.Net.Http.Headers
Imports System.Text

Public Class Form1
    Private _client As New Lazy(Of HttpClient)(Function()
                                                   Dim client = New HttpClient With {
                                                       .BaseAddress = New Uri("https://localhost:7175")
                                                   }
                                                   client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:91.0) Gecko/20100101 Firefox/91.0 SeaMonkey/2.53.18.2")
                                                   Return client
                                               End Function)

    Private Async Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        sender.Enabled = False
        Try
            Dim response = Await _client.Value.GetAsync($"/api/pages/{Uri.EscapeDataString(TextBox1.Text)}")
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
            Dim response = Await _client.Value.PutAsync($"/api/pages/{Uri.EscapeDataString(TextBox1.Text)}", content)
            response.EnsureSuccessStatusCode()
        Finally
            sender.Enabled = True
        End Try
    End Sub

    Private Async Sub Button3_Click(sender As Object, e As EventArgs) Handles Button3.Click
        sender.Enabled = False
        Try
            Dim response = Await _client.Value.DeleteAsync($"/api/pages/{Uri.EscapeDataString(TextBox1.Text)}")
            response.EnsureSuccessStatusCode
        Finally
            sender.Enabled = True
        End Try
    End Sub

    Private Async Sub Button4_Click(sender As Object, e As EventArgs) Handles Button4.Click
        sender.Enabled = False
        Try
            Dim response = Await _client.Value.PostAsync($"/api/pages/{Uri.EscapeDataString(TextBox1.Text)}/show", New StringContent(""))
            response.EnsureSuccessStatusCode()
        Finally
            sender.Enabled = True
        End Try
    End Sub

    Private Async Sub Button5_Click(sender As Object, e As EventArgs) Handles Button5.Click
        sender.Enabled = False
        Try
            Dim response = Await _client.Value.PostAsync($"/api/pages/{Uri.EscapeDataString(TextBox1.Text)}/hide", New StringContent(""))
            response.EnsureSuccessStatusCode()
        Finally
            sender.Enabled = True
        End Try
    End Sub
End Class
