﻿namespace Chathub.API.Domain.Data.Models
{
    public class AccessToken
    {
        public string Value { get; set; }
        public AccessToken(string value) { Value = value; }
    }
}
